$ErrorActionPreference = "Stop"

$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  $scriptPath = '"' + $PSCommandPath + '"'
  Start-Process -FilePath "powershell.exe" -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -NoExit -File $scriptPath"
  exit
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $projectRoot ".env"
$envLines = [System.IO.File]::ReadAllLines($envPath)
$databaseLineIndex = -1
foreach ($index in 0..($envLines.Length - 1)) {
  if ($envLines[$index] -match '^\s*DATABASE_URL\s*=') { $databaseLineIndex = $index; break }
}
if ($databaseLineIndex -lt 0 -or $envLines[$databaseLineIndex] -notmatch 'postgresql://postgres:[^@]*@localhost:5432/musea\?schema=public') {
  throw "The project's DATABASE_URL is not the expected local musea database; refusing to change it."
}

$pgHome = "C:\Program Files\PostgreSQL\17"
$configPath = Join-Path $pgHome "data\pg_hba.conf"
$psqlPath = Join-Path $pgHome "bin\psql.exe"
$serviceName = "postgresql-x64-17"
if (-not (Test-Path -LiteralPath $configPath) -or -not (Test-Path -LiteralPath $psqlPath)) {
  throw "PostgreSQL 17 was not found at its standard installation path."
}

$originalConfig = [System.IO.File]::ReadAllBytes($configPath)
$temporaryRule = [System.Text.Encoding]::ASCII.GetBytes("host all postgres 127.0.0.1/32 trust`n")
$temporaryConfig = [byte[]]::new($temporaryRule.Length + $originalConfig.Length)
[Array]::Copy($temporaryRule, 0, $temporaryConfig, 0, $temporaryRule.Length)
[Array]::Copy($originalConfig, 0, $temporaryConfig, $temporaryRule.Length, $originalConfig.Length)
$randomBytes = New-Object byte[] 32
$randomGenerator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$randomGenerator.GetBytes($randomBytes)
$newPassword = [BitConverter]::ToString($randomBytes).Replace("-", "").ToLowerInvariant()
$temporaryConfigWritten = $false
$passwordUpdated = $false

try {
  [System.IO.File]::WriteAllBytes($configPath, $temporaryConfig)
  $temporaryConfigWritten = $true
  Restart-Service -Name $serviceName -Force

  $sql = "ALTER ROLE postgres WITH PASSWORD '$newPassword';"
  $sql | & $psqlPath -X -v ON_ERROR_STOP=1 -h 127.0.0.1 -U postgres -d postgres
  if ($LASTEXITCODE -ne 0) { throw "Could not update the local PostgreSQL password." }
  $passwordUpdated = $true
}
finally {
  if ($temporaryConfigWritten) {
    [System.IO.File]::WriteAllBytes($configPath, $originalConfig)
    Restart-Service -Name $serviceName -Force
  }
  $randomGenerator.Dispose()
}

if (-not $passwordUpdated) { throw "PostgreSQL credentials were not updated." }
$envLines[$databaseLineIndex] = "DATABASE_URL=`"postgresql://postgres:$newPassword@localhost:5432/musea?schema=public`""
[System.IO.File]::WriteAllLines($envPath, $envLines, [System.Text.UTF8Encoding]::new($false))
$env:PGPASSWORD = $newPassword
try {
  $databaseExists = (& $psqlPath -X -w -A -t -h 127.0.0.1 -U postgres -d postgres -c "SELECT 1 FROM pg_database WHERE datname = 'musea'").Trim()
  if ($LASTEXITCODE -ne 0) { throw "Could not verify the local musea database." }
  if ($databaseExists -ne "1") {
    & $psqlPath -X -w -v ON_ERROR_STOP=1 -h 127.0.0.1 -U postgres -d postgres -c "CREATE DATABASE musea"
    if ($LASTEXITCODE -ne 0) { throw "Could not create the local musea database." }
  }
  & $psqlPath -X -w -v ON_ERROR_STOP=1 -h 127.0.0.1 -U postgres -d musea -c "SELECT 1"
  if ($LASTEXITCODE -ne 0) { throw "The musea database is not accepting the new credentials." }
}
finally {
  Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Output "Local PostgreSQL credentials repaired and stored in museum-platform/.env. No museum tables or records were changed."
