require("dotenv/config");

const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const seedPath = path.resolve(__dirname, "../prisma/seed.ts");
const source = fs.readFileSync(seedPath, "utf8");
const javascript = ts.transpile(source, {
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2022,
  esModuleInterop: true,
});
const seedModule = new Module(seedPath, module);
seedModule.filename = seedPath;
seedModule.paths = Module._nodeModulePaths(path.dirname(seedPath));
seedModule._compile(javascript, seedPath);
