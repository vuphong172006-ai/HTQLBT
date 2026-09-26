const db = {
  artifacts: [
    { id: 'ART-0234', name: 'Trống đồng Ngọc Lũ', period: 'Đông Sơn', year: 'TK III TCN', category: 'Khảo cổ', status: 'Trưng bày', icon: '🥁', tone: 'blue', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ngoc%20Lu.jpg' },
    { id: 'ART-0189', name: 'Tượng Phật Đồng Dương', period: 'Champa', year: 'TK IX', category: 'Điêu khắc', status: 'Bảo quản', icon: '🗿', tone: 'peach', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Buddha%2C%20T%C6%B0%E1%BB%A3ng%20Ph%E1%BA%ADt%20%C4%90%E1%BB%93ng%20D%C6%B0%C6%A1ng%2C%20the%20Museum%20of%20Vietnamese%20History.jpg' },
    { id: 'ART-0456', name: 'Mộc bản triều Nguyễn', period: 'Nguyễn', year: '1802 - 1945', category: 'Tư liệu', status: 'Trưng bày', icon: '📜', tone: 'yellow', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Woodblocks%20of%20the%20Nguy%E1%BB%85n%20Dynasty%2003.jpg' },
    { id: 'ART-0312', name: 'Ấm tử sa Chu Nê', period: 'Lê sơ', year: 'TK XV', category: 'Gốm sứ', status: 'Đang nghiên cứu', icon: '🏺', tone: 'green', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Yixing%20ware%20teapot%20and%20Lapsang%20tea.jpg' },
    { id: 'ART-0520', name: 'Trống đồng Đông Sơn', period: 'Đông Sơn', year: 'TK II TCN', category: 'Khảo cổ', status: 'Trưng bày', icon: '🥁', tone: 'blue', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dong%20Son%20drums.jpg' },
    { id: 'ART-0678', name: 'Tượng thần Shiva Champa', period: 'Champa', year: 'TK VIII', category: 'Điêu khắc', status: 'Bảo quản', icon: '🪨', tone: 'peach', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/T%C6%B0%E1%BB%A3ng%20Ph%E1%BA%ADt%20Ch%C4%83m.jpg' },
    { id: 'ART-0741', name: 'Tượng Phật đồng cổ', period: 'Phù Nam', year: 'TK VIII - IX', category: 'Điêu khắc', status: 'Trưng bày', icon: '🗿', tone: 'yellow', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bronze%20Buddha%20%288%E2%80%939th%20century%29%2C%20Museum%20of%20Vietnamese%20History%2C%20Ho%20Chi%20Minh%20City%20-%2020121014.JPG' },
    { id: 'ART-0815', name: 'Mộc bản Ngự chế', period: 'Nguyễn', year: 'TK XIX', category: 'Tư liệu', status: 'Đang nghiên cứu', icon: '📜', tone: 'green', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Woodblocks%20of%20the%20Nguy%E1%BB%85n%20Dynasty%2001.jpg' },
    { id: 'ART-0933', name: 'Ấm đất Nghi Hưng cổ', period: 'Thanh', year: 'TK XVIII', category: 'Gốm sứ', status: 'Trưng bày', icon: '🫖', tone: 'peach', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/YixingClayTeapotByChenMingyuanOfQingDynasty-TianqingClay.jpg' },
    { id: 'ART-1042', name: 'Phù điêu vũ nữ Apsara', period: 'Champa', year: 'TK X', category: 'Điêu khắc', status: 'Bảo quản', icon: '🧱', tone: 'yellow', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Champa%20Bronze%20%289980585726%29.jpg' }
  ],
  exhibitions: [
    { name: 'Dòng chảy Văn Lang', visitors: '8.420', progress: 78, color: 'terracotta', date: '12.06 — 30.12.2026' },
    { name: 'Nghệ thuật Champa', visitors: '6.190', progress: 61, color: 'gold', date: '03.03 — 15.11.2026' },
    { name: 'Di sản Ký ức', visitors: '3.850', progress: 43, color: 'green', date: '22.08 — 20.01.2027' }
  ],
  ticketCustomers: [
    { code: 'MUS-967706', name: 'Minh Anh', contact: 'minhanh@example.com', exhibition: 'Dòng chảy Văn Lang', date: '20/09/2026', quantity: '2 người', amount: '160.000đ', source: 'Online', status: 'Đã thanh toán' },
    { code: 'POS-240918', name: 'Trần Quốc Bảo', contact: 'Quầy vé số 01', exhibition: 'Tham quan toàn bộ bảo tàng', date: '18/09/2026', quantity: '3 người', amount: '240.000đ', source: 'Tại quầy', status: 'Đã thanh toán' },
    { code: 'MUS-967321', name: 'Lê Thu Hà', contact: 'lethuha@example.com', exhibition: 'Nghệ thuật Champa', date: '18/09/2026', quantity: '1 người', amount: '80.000đ', source: 'Online', status: 'Đã thanh toán' },
    { code: 'POS-240917', name: 'Nguyễn Hoàng Nam', contact: 'Quầy vé số 02', exhibition: 'Di sản Ký ức', date: '17/09/2026', quantity: '4 người', amount: '320.000đ', source: 'Tại quầy', status: 'Đã thanh toán' }
  ],
  payments: [
    { code: 'MUS-967706', name: 'Minh Anh', time: '20/09/2026 · 09:42', source: 'Online', method: 'MoMo', amount: '160.000đ', status: 'Đã nhận tiền' },
    { code: 'POS-240918', name: 'Trần Quốc Bảo', time: '18/09/2026 · 10:15', source: 'Tại quầy', method: 'Tiền mặt', amount: '240.000đ', status: 'Đã nhận tiền' },
    { code: 'MUS-967321', name: 'Lê Thu Hà', time: '18/09/2026 · 08:06', source: 'Online', method: 'VNPay', amount: '80.000đ', status: 'Đã nhận tiền' },
    { code: 'POS-240917', name: 'Nguyễn Hoàng Nam', time: '17/09/2026 · 15:28', source: 'Tại quầy', method: 'Thẻ ngân hàng', amount: '320.000đ', status: 'Đã nhận tiền' },
    { code: 'MUS-966904', name: 'Phạm Ngọc Lan', time: '16/09/2026 · 11:03', source: 'Online', method: 'MoMo', amount: '120.000đ', status: 'Đã hoàn tiền' }
  ],
  guestPayments: [
    { code: 'MUS-967102', exhibition: 'Nghệ thuật Champa', date: '12/09/2026', method: 'VNPay', amount: '80.000đ', status: 'Đã thanh toán' },
    { code: 'MUS-966874', exhibition: 'Dòng chảy Văn Lang', date: '05/09/2026', method: 'MoMo', amount: '160.000đ', status: 'Đã thanh toán' }
  ]
};

const pageContent = document.getElementById('page-content');
const breadcrumb = document.getElementById('breadcrumb');
const toast = document.getElementById('toast');
const titles = { overview: 'Tổng quan', collections: 'Hiện vật & bộ sưu tập', 'artifact-info': 'Thông tin hiện vật', tickets: 'Đặt vé online', 'guest-payments': 'Thanh toán & lịch sử vé', visitors: 'Khách tham quan', 'ticket-customers': 'Khách hàng & vé', 'payment-history': 'Lịch sử nhận tiền', exhibitions: 'Triển lãm', analytics: 'Phân tích dữ liệu', ai: 'Trợ lý MuseAI', settings: 'Cài đặt' };
const accounts = {
  admin: { identity: 'admin@musea.vn', password: 'Musea@2026', name: 'Nguyễn Hà', initials: 'NH', label: 'Quản trị viên' },
  guest: { identity: 'guest@musea.vn', password: 'Guest@2026', name: 'Minh Anh', initials: 'MA', label: 'Khách tham quan' }
};
const guestAccountStorageKey = 'musea_guest_accounts';
let customerAccounts = [];
let currentUser = null;
let selectedRole = 'admin';
let pendingTicket = null;

function getStoredGuestAccounts() {
  try {
    const saved = JSON.parse(localStorage.getItem(guestAccountStorageKey) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveGuestAccounts() {
  localStorage.setItem(guestAccountStorageKey, JSON.stringify(customerAccounts));
}

function getGuestAccounts() {
  return [accounts.guest, ...customerAccounts.map(account => ({ ...account, role: 'guest', label: 'Khách tham quan' }))];
}

function getInitials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'KH';
}

function findAccountByCredentials(role, identity, password) {
  const normalizedIdentity = identity.toLowerCase();
  if (role === 'admin') {
    const adminAccount = accounts.admin;
    return normalizedIdentity === adminAccount.identity && password === adminAccount.password ? { ...adminAccount, role: 'admin' } : null;
  }
  const guestAccount = getGuestAccounts().find(account => account.identity.toLowerCase() === normalizedIdentity && account.password === password);
  return guestAccount ? { ...guestAccount, role: 'guest' } : null;
}

customerAccounts = getStoredGuestAccounts();

function showAuth() {
  document.getElementById('auth-screen').classList.remove('hidden');
  document.querySelector('.app-shell').classList.remove('authenticated');
}

function enterApp(user) {
  currentUser = user;
  document.getElementById('auth-screen').classList.add('hidden');
  document.querySelector('.app-shell').classList.add('authenticated');
  document.getElementById('sidebar-avatar').textContent = user.initials;
  document.getElementById('top-avatar').textContent = user.initials;
  document.getElementById('sidebar-name').textContent = user.name;
  document.getElementById('top-name').textContent = user.name;
  document.getElementById('sidebar-role').textContent = user.label;
  document.querySelectorAll('.nav-item[data-roles]').forEach(item => { item.hidden = !item.dataset.roles.split(',').includes(user.role); });
  render('overview');
}

function switchAuthForm(view) {
  const isRegister = view === 'register';
  document.getElementById('login-form').classList.toggle('hidden', isRegister);
  document.getElementById('register-form').classList.toggle('hidden', !isRegister);
  document.getElementById('login-error').textContent = '';
  document.getElementById('register-error').textContent = '';
  if (isRegister) {
    selectedRole = 'guest';
    document.querySelectorAll('.role-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.role === 'guest'));
  }
}

function bindAuth() {
  document.querySelectorAll('.role-tab').forEach(tab => tab.addEventListener('click', () => {
    selectedRole = tab.dataset.role;
    document.querySelectorAll('.role-tab').forEach(item => item.classList.toggle('active', item === tab));
    document.getElementById('login-identity').placeholder = selectedRole === 'admin' ? 'Nhập email quản trị viên' : 'Nhập email khách tham quan';
    document.querySelector('.demo-hint').innerHTML = selectedRole === 'admin' ? 'Tài khoản demo: <b>admin@musea.vn</b> / <b>Musea@2026</b>' : 'Tài khoản demo: <b>guest@musea.vn</b> / <b>Guest@2026</b>';
    if (!document.getElementById('register-form').classList.contains('hidden')) {
      switchAuthForm('login');
    }
  }));
  document.getElementById('toggle-password').addEventListener('click', () => { const input = document.getElementById('login-password'); input.type = input.type === 'password' ? 'text' : 'password'; });
  document.getElementById('toggle-register-password').addEventListener('click', () => { const input = document.getElementById('register-password'); input.type = input.type === 'password' ? 'text' : 'password'; });
  document.getElementById('toggle-register-confirm-password').addEventListener('click', () => { const input = document.getElementById('register-confirm-password'); input.type = input.type === 'password' ? 'text' : 'password'; });
  document.getElementById('show-register').addEventListener('click', () => switchAuthForm('register'));
  document.getElementById('show-login').addEventListener('click', () => switchAuthForm('login'));
  document.getElementById('register-form').addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const error = document.getElementById('register-error');

    if (!name || !email || !password || !confirmPassword) {
      error.textContent = 'Vui lòng điền đầy đủ thông tin để đăng ký.';
      return;
    }
    if (password.length < 6) {
      error.textContent = 'Mật khẩu phải có ít nhất 6 ký tự.';
      return;
    }
    if (password !== confirmPassword) {
      error.textContent = 'Mật khẩu xác nhận không khớp.';
      return;
    }
    if (getGuestAccounts().some(account => account.identity.toLowerCase() === email)) {
      error.textContent = 'Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.';
      return;
    }

    const newGuestAccount = {
      identity: email,
      password,
      name,
      initials: getInitials(name),
      label: 'Khách tham quan'
    };

    customerAccounts.push(newGuestAccount);
    saveGuestAccounts();
    document.getElementById('register-form').reset();
    document.getElementById('login-identity').value = email;
    document.getElementById('login-password').value = password;
    switchAuthForm('login');
    document.getElementById('login-error').textContent = 'Đăng ký tài khoản thành công. Bạn có thể đăng nhập ngay.';
    showToast('Đăng ký tài khoản khách thành công.');
  });
  document.getElementById('login-form').addEventListener('submit', event => {
    event.preventDefault();
    const identity = document.getElementById('login-identity').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const account = findAccountByCredentials(selectedRole, identity, password);
    const error = document.getElementById('login-error');
    if (!account) {
      error.textContent = selectedRole === 'admin'
        ? 'Thông tin đăng nhập chưa chính xác. Hãy thử tài khoản demo bên dưới.'
        : 'Email hoặc mật khẩu không đúng. Nếu chưa có tài khoản, hãy đăng ký trước.';
      return;
    }
    error.textContent = '';
    enterApp({ ...account, role: selectedRole });
    showToast(`Đăng nhập thành công với quyền ${account.label.toLowerCase()}.`);
  });
  document.getElementById('forgot-password').addEventListener('click', event => { event.preventDefault(); document.getElementById('login-error').textContent = 'Liên hệ quản trị hệ thống để đặt lại mật khẩu.'; });
}

function overviewView() {
  const displayName = currentUser ? currentUser.name.split(' ').pop() : 'bạn';
  return `<section class="page-heading"><div><p class="eyebrow">Thứ Hai, 07 tháng 09, 2026</p><h1>Chào buổi sáng, ${displayName}! <span>✦</span></h1><p class="subtitle">Đây là những gì đang diễn ra tại bảo tàng hôm nay.</p></div><button class="primary-btn" data-action="report">＋ Tạo báo cáo</button></section>
  <section class="stats-grid"><article class="stat-card accent"><div class="stat-top"><span>Lượt khách hôm nay</span><b class="trend up">↗ 12.8%</b></div><strong>1,248</strong><div class="sparkline"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><small>So với cùng kỳ tuần trước</small></article>
  <article class="stat-card"><div class="stat-top"><span>Tổng hiện vật</span><b class="trend up">↗ 2.4%</b></div><strong>12,684</strong><div class="stat-meta"><span class="mini-icon blue-bg">◈</span><small>18 hiện vật mới tháng này</small></div></article>
  <article class="stat-card"><div class="stat-top"><span>Đánh giá trung bình</span><b class="trend up">↗ 0.3</b></div><strong>4.8 <em>/ 5</em></strong><div class="stars">★★★★★ <small>từ 2,846 đánh giá</small></div></article>
  <article class="stat-card"><div class="stat-top"><span>Triển lãm đang diễn ra</span><b class="trend neutral">Ổn định</b></div><strong>06</strong><div class="stat-meta"><span class="mini-icon orange-bg">◫</span><small>02 sẽ kết thúc trong tháng</small></div></article></section>
  <section class="dashboard-grid"><article class="panel traffic-panel"><div class="panel-head"><div><h2>Lượng khách tham quan</h2><p>Thống kê theo ngày trong tháng 09</p></div><button class="select-btn">Tháng này <span>⌄</span></button></div><div class="chart-wrap"><div class="y-axis"><span>2k</span><span>1.5k</span><span>1k</span><span>500</span><span>0</span></div><div class="chart"><div class="grid-lines"><i></i><i></i><i></i><i></i><i></i></div><svg viewBox="0 0 650 190" preserveAspectRatio="none" aria-label="Biểu đồ khách tham quan"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#c95f3d" stop-opacity=".22"/><stop offset="1" stop-color="#c95f3d" stop-opacity="0"/></linearGradient></defs><path class="area" d="M0,140 C30,128 38,94 68,110 S105,145 135,116 S170,72 198,90 S235,130 264,102 S310,65 335,78 S370,111 402,68 S445,45 468,73 S495,90 528,42 S565,74 590,36 S630,48 650,24 L650,190 L0,190Z"/><path class="line" d="M0,140 C30,128 38,94 68,110 S105,145 135,116 S170,72 198,90 S235,130 264,102 S310,65 335,78 S370,111 402,68 S445,45 468,73 S495,90 528,42 S565,74 590,36 S630,48 650,24"/></svg><div class="x-axis"><span>01/09</span><span>05/09</span><span>10/09</span><span>15/09</span><span>20/09</span><span>25/09</span><span>30/09</span></div></div></div></article>
  <article class="panel ai-insight"><div class="panel-head"><div><h2><span class="sparkle">✦</span> Gợi ý từ MuseAI</h2><p>Phân tích thông minh từ dữ liệu bảo tàng</p></div><span class="live-label"><i></i> Đang hoạt động</span></div><div class="insight-main"><div class="insight-orb">✦</div><div><strong>Khung giờ vàng sắp tới</strong><p>Lượng khách dự kiến tăng <b>28%</b> vào 14:00 hôm nay dựa trên dữ liệu 90 ngày.</p></div></div><div class="insight-footer"><span>Độ tin cậy <b>94%</b></span><button class="text-btn" data-view="ai">Xem phân tích →</button></div></article></section>
  <section class="lower-grid"><article class="panel"><div class="panel-head"><div><h2>Hoạt động gần đây</h2><p>Cập nhật theo thời gian thực</p></div><button class="text-btn">Xem tất cả →</button></div><div class="activity-list"><div class="activity"><span class="activity-icon blue-bg">◈</span><div><strong>Đã thêm hiện vật mới</strong><p>Ấm tử sa Chu Nê · Bộ sưu tập Gốm sứ</p></div><time>10 phút trước</time></div><div class="activity"><span class="activity-icon orange-bg">♧</span><div><strong>Triển lãm được cập nhật</strong><p>Dòng chảy Văn Lang · Thay đổi nội dung khu B</p></div><time>1 giờ trước</time></div><div class="activity"><span class="activity-icon green-bg">♙</span><div><strong>Đạt mốc khách tham quan</strong><p>10.000 lượt · Triển lãm Nghệ thuật Champa</p></div><time>3 giờ trước</time></div></div></article><article class="panel quick-panel"><div class="panel-head"><div><h2>Truy cập nhanh</h2><p>Các tác vụ thường dùng</p></div></div><div class="quick-actions"><button data-view="collections"><span>＋</span><b>Thêm hiện vật</b><small>Tạo hồ sơ hiện vật mới</small></button><button data-view="visitors"><span>♙</span><b>Xuất báo cáo khách</b><small>Phân tích lượt tham quan</small></button><button data-view="ai"><span class="sparkle">✦</span><b>Hỏi MuseAI</b><small>Nhận câu trả lời tức thì</small></button></div></article></section>`;
}

function artifactModalHtml(artifact = null) {
  const mode = artifact ? 'edit' : 'add';
  const item = artifact || { id: '', name: '', period: '', year: '', category: 'Khảo cổ', status: 'Trưng bày', icon: '◈', tone: 'blue', imageUrl: '' };
  return `<div class="artifact-modal-backdrop" id="artifact-modal-backdrop">
    <div class="artifact-modal panel">
      <div class="modal-head"><h2>${mode === 'edit' ? 'Sửa hiện vật' : 'Thêm hiện vật mới'}</h2><button type="button" class="close-modal" data-close-artifact-modal aria-label="Đóng">×</button></div>
      <form id="artifact-form" data-artifact-id="${item.id}">
        <div class="artifact-form-grid">
          <label>Tên hiện vật<input name="name" type="text" value="${item.name}" required></label>
          <label>Mã hiện vật<input name="id" type="text" value="${item.id}" ${mode === 'edit' ? 'readonly' : 'required'}></label>
          <label>Thời kỳ<input name="period" type="text" value="${item.period}" required></label>
          <label>Niên đại<input name="year" type="text" value="${item.year}" required></label>
          <label>Loại hình<select name="category"><option ${item.category === 'Khảo cổ' ? 'selected' : ''}>Khảo cổ</option><option ${item.category === 'Điêu khắc' ? 'selected' : ''}>Điêu khắc</option><option ${item.category === 'Tư liệu' ? 'selected' : ''}>Tư liệu</option><option ${item.category === 'Gốm sứ' ? 'selected' : ''}>Gốm sứ</option></select></label>
          <label>Trạng thái<select name="status"><option ${item.status === 'Trưng bày' ? 'selected' : ''}>Trưng bày</option><option ${item.status === 'Bảo quản' ? 'selected' : ''}>Bảo quản</option><option ${item.status === 'Đang nghiên cứu' ? 'selected' : ''}>Đang nghiên cứu</option></select></label>
          <label>Biểu tượng<input name="icon" type="text" value="${item.icon}" maxlength="2"></label>
          <label>URL hình ảnh<input name="imageUrl" type="url" value="${item.imageUrl}" placeholder="https://..."></label>
        </div>
        <div class="modal-actions">
          <button type="button" class="secondary-btn" data-close-artifact-modal>Hủy</button>
          <button type="submit" class="primary-btn">${mode === 'edit' ? 'Lưu thay đổi' : 'Thêm hiện vật'}</button>
        </div>
      </form>
    </div>
  </div>`;
}

function collectionsView() { return `<section class="page-heading"><div><p class="eyebrow">Kho dữ liệu di sản</p><h1>Hiện vật &amp; bộ sưu tập</h1><p class="subtitle">Theo dõi, phân loại và bảo tồn 12.684 hiện vật của bảo tàng.</p></div><button class="primary-btn" data-action="add">＋ Thêm hiện vật</button></section><section class="toolbar"><div class="search-box">⌕<input id="artifact-search" placeholder="Tìm theo tên, mã hiện vật..." /></div><button class="filter-btn">☷ Bộ lọc <span>2</span></button><button class="select-btn">Tất cả trạng thái ⌄</button></section><div class="collection-table panel"><div class="table-head"><span>HIỆN VẬT</span><span>NIÊN ĐẠI</span><span>LOẠI HÌNH</span><span>TRẠNG THÁI</span><span>THAO TÁC</span></div><div id="artifact-rows">${artifactRows(db.artifacts)}</div></div><div id="artifact-modal-root"></div>`; }
function artifactRows(items) { return items.map(a => `<div class="table-row"><div class="artifact-name"><span class="artifact-thumb ${a.tone}"><img src="${a.imageUrl}" alt="${a.name}" onerror="this.style.display='none'">${a.icon}</span><div><strong>${a.name}</strong><small>${a.id} · ${a.period}</small></div></div><span>${a.year}</span><span>${a.category}</span><span><b class="status ${a.status === 'Trưng bày' ? 'on' : a.status === 'Bảo quản' ? 'hold' : 'research'}">${a.status}</b></span><div class="artifact-actions">${currentUser && currentUser.role === 'admin' ? `<button class="row-action" data-action="edit-artifact" data-id="${a.id}">Sửa</button><button class="row-action danger" data-action="delete-artifact" data-id="${a.id}">Xóa</button>` : '<span>Chỉ xem</span>'}</div></div>`).join(''); }
function artifactDescription(artifact) { const descriptions = { 'Khảo cổ': 'Hiện vật khảo cổ phản ánh kỹ thuật chế tác và đời sống của cư dân cổ trong lịch sử Việt Nam.', 'Điêu khắc': 'Tác phẩm điêu khắc mang giá trị nghệ thuật, tín ngưỡng và dấu ấn văn hóa của một thời kỳ.', 'Tư liệu': 'Tư liệu gốc được lưu giữ để nghiên cứu, giáo dục và bảo tồn ký ức lịch sử.', 'Gốm sứ': 'Hiện vật gốm sứ cho thấy kỹ thuật thủ công, thẩm mỹ và giao lưu văn hóa qua các thời kỳ.' }; return descriptions[artifact.category] || 'Hiện vật đang được lưu giữ và giới thiệu tại Bảo tàng Lịch sử Quốc gia.'; }
function openArtifactModal(artifact = null) { const root = document.getElementById('artifact-modal-root'); if (!root) return; root.innerHTML = artifactModalHtml(artifact); }
function closeArtifactModal() { const root = document.getElementById('artifact-modal-root'); if (!root) return; root.innerHTML = ''; }
function handleArtifactSubmit(event) {
  if (event.target.id !== 'artifact-form') return;
  event.preventDefault();
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Chỉ quản trị viên mới có quyền quản lý hiện vật.');
    return;
  }
  const form = event.target;
  const rawId = form.dataset.artifactId || form.elements.id.value.trim();
  const artifactId = rawId || `ART-${Date.now().toString().slice(-4)}`;
  const payload = {
    id: artifactId,
    name: form.elements.name.value.trim(),
    period: form.elements.period.value.trim(),
    year: form.elements.year.value.trim(),
    category: form.elements.category.value,
    status: form.elements.status.value,
    icon: form.elements.icon.value.trim() || '◈',
    tone: form.elements.category.value === 'Khảo cổ' ? 'blue' : form.elements.category.value === 'Điêu khắc' ? 'peach' : form.elements.category.value === 'Tư liệu' ? 'yellow' : 'green',
    imageUrl: form.elements.imageUrl.value.trim() || 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80'
  };
  if (!payload.name || !payload.period || !payload.year) {
    showToast('Vui lòng điền đầy đủ thông tin hiện vật.');
    return;
  }
  const index = db.artifacts.findIndex(item => item.id === artifactId);
  if (index >= 0) {
    db.artifacts[index] = { ...db.artifacts[index], ...payload };
    showToast('Cập nhật hiện vật thành công.');
  } else {
    db.artifacts.unshift(payload);
    showToast('Đã thêm hiện vật mới.');
  }
  closeArtifactModal();
  render('collections');
}
function handleArtifactDelete(artifactId) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Chỉ quản trị viên mới có quyền xóa hiện vật.');
    return;
  }
  const item = db.artifacts.find(artifact => artifact.id === artifactId);
  if (!item) return;
  if (!window.confirm(`Bạn có chắc muốn xóa hiện vật "${item.name}"?`)) return;
  db.artifacts = db.artifacts.filter(artifact => artifact.id !== artifactId);
  render('collections');
  showToast('Đã xóa hiện vật.');
}
function publicArtifactCards(items) { return items.map(a => `<article class="public-artifact-card"><div class="public-artifact-image ${a.tone}"><img src="${a.imageUrl}" alt="${a.name}" onerror="this.style.display='none'"><span>${a.icon}</span><b>${a.status}</b></div><div class="public-artifact-body"><div class="public-artifact-meta"><span>${a.category}</span><small>${a.id}</small></div><h2>${a.name}</h2><p>${artifactDescription(a)}</p><dl><div><dt>Niên đại</dt><dd>${a.year}</dd></div><div><dt>Thời kỳ</dt><dd>${a.period}</dd></div></dl></div></article>`).join(''); }
function artifactInfoView() { return `<section class="page-heading"><div><p class="eyebrow">DÀNH CHO KHÁCH THAM QUAN</p><h1>Thông tin hiện vật</h1><p class="subtitle">Khám phá những câu chuyện, chất liệu và niên đại phía sau các hiện vật tiêu biểu.</p></div><span class="visitor-badge">◉ Chế độ tham quan</span></section><section class="toolbar"><div class="search-box">⌕<input id="public-artifact-search" placeholder="Tìm tên hiện vật, thời kỳ..." /></div><span class="collection-count">${db.artifacts.length} hiện vật tiêu biểu</span></section><section class="public-artifact-grid" id="public-artifact-grid">${publicArtifactCards(db.artifacts)}</section>`; }
function ticketsView() { return `<section class="page-heading"><div><p class="eyebrow">DÀNH CHO KHÁCH THAM QUAN</p><h1>Đặt vé online</h1><p class="subtitle">Chọn lịch tham quan và nhận vé điện tử ngay sau khi hoàn tất đăng ký.</p></div><span class="visitor-badge">✦ Vé điện tử</span></section><section class="ticket-layout"><form class="ticket-form panel" id="ticket-form"><div class="form-section-title"><span>01</span><div><h2>Thông tin chuyến tham quan</h2><p>Vé có hiệu lực trong ngày đã chọn.</p></div></div><label>Triển lãm muốn tham quan<select id="ticket-exhibition"><option>Dòng chảy Văn Lang</option><option>Nghệ thuật Champa</option><option>Di sản Ký ức</option><option>Tham quan toàn bộ bảo tàng</option></select></label><div class="ticket-fields"><label>Ngày tham quan<input id="ticket-date" type="date" required></label><label>Khung giờ<select id="ticket-slot"><option>08:00 — 10:00</option><option>10:00 — 12:00</option><option>14:00 — 16:00</option><option>16:00 — 18:00</option></select></label></div><div class="form-section-title second"><span>02</span><div><h2>Thông tin liên hệ</h2><p>Vé sẽ được gửi tới email của bạn.</p></div></div><label>Họ và tên<input id="ticket-name" type="text" placeholder="Nguyễn Văn A" required></label><label>Email nhận vé<input id="ticket-email" type="email" placeholder="email@example.com" required></label><div class="ticket-fields"><label>Số vé người lớn<div class="number-stepper"><button type="button" data-step="adult" data-delta="-1">−</button><strong id="adult-count">1</strong><button type="button" data-step="adult" data-delta="1">＋</button></div></label><label>Số vé trẻ em<div class="number-stepper"><button type="button" data-step="child" data-delta="-1">−</button><strong id="child-count">0</strong><button type="button" data-step="child" data-delta="1">＋</button></div></label></div><button class="primary-btn ticket-submit" type="submit">Xác nhận đặt vé <span>→</span></button></form><aside class="ticket-summary panel"><div class="summary-top"><span class="ticket-icon">▣</span><div><strong>Vé tham quan bảo tàng</strong><small>Vé điện tử · Không cần in</small></div></div><div class="summary-details"><div><span>Triển lãm</span><b id="summary-exhibition">Dòng chảy Văn Lang</b></div><div><span>Ngày &amp; giờ</span><b id="summary-datetime">Chọn ngày tham quan</b></div><div><span>Số lượng</span><b id="summary-quantity">1 người lớn</b></div></div><div class="summary-price"><span>Tổng thanh toán</span><strong id="ticket-total">80.000đ</strong></div><p class="ticket-note">Hủy vé miễn phí trước 24 giờ. Mỗi vé bao gồm quyền tham quan các khu trưng bày cố định.</p></aside></section><div class="booking-success" id="booking-success"><span>✓</span><div><strong>Đặt vé thành công!</strong><p>Mã vé của bạn là <b id="booking-code"></b>. Vé điện tử đã được ghi nhận.</p></div><button class="text-btn" id="new-booking">Đặt vé khác →</button></div>`; }
function guestPaymentRows() { return db.guestPayments.map(payment => `<div class="guest-payment-row"><div><strong>${payment.code}</strong><small>${payment.date}</small></div><div><strong>${payment.exhibition}</strong><small>Vé tham quan bảo tàng</small></div><span class="guest-method">${payment.method}</span><strong>${payment.amount}</strong><b class="paid-status ${payment.status === 'Chờ thanh toán' ? 'pending' : ''}">${payment.status}</b></div>`).join(''); }
function guestPaymentsView() { return `<section class="page-heading"><div><p class="eyebrow">TÀI KHOẢN KHÁCH THAM QUAN</p><h1>Thanh toán &amp; lịch sử vé</h1><p class="subtitle">Thanh toán vé an toàn và xem lại các giao dịch của bạn.</p></div><span class="visitor-badge">🔒 Thanh toán bảo mật</span></section><section class="guest-payment-layout"><form class="online-payment-card panel" id="online-payment-form"><div class="form-section-title"><span>01</span><div><h2>Thanh toán vé online</h2><p>Thông tin thanh toán được bảo mật.</p></div></div><label>Chọn vé cần thanh toán<select id="payment-ticket"><option value="Dòng chảy Văn Lang|MUS-968014|80.000đ">MUS-968014 · Dòng chảy Văn Lang · 80.000đ</option><option value="Nghệ thuật Champa|MUS-968015|80.000đ">MUS-968015 · Nghệ thuật Champa · 80.000đ</option></select></label><p class="payment-label">Phương thức thanh toán</p><div class="payment-methods"><button type="button" class="payment-method-option active" data-method="MoMo"><strong>MoMo</strong><small>Ví điện tử</small></button><button type="button" class="payment-method-option" data-method="VNPay"><strong>VNPay</strong><small>Cổng thanh toán</small></button><button type="button" class="payment-method-option" data-method="Thẻ ngân hàng"><strong>VISA</strong><small>Thẻ ngân hàng</small></button></div><div class="card-fields"><label>Số thẻ<input placeholder="••••  ••••  ••••  1234" inputmode="numeric"></label><div class="ticket-fields"><label>Ngày hết hạn<input placeholder="MM / YY"></label><label>Mã CVV<input placeholder="•••" type="password"></label></div></div><button class="primary-btn ticket-submit" type="submit">Thanh toán 80.000đ <span>→</span></button><p class="secure-note">🔒 Giao dịch được mã hóa và bảo vệ bởi MUSEA Secure Pay.</p></form><aside class="guest-payment-info panel"><span class="ticket-icon">₫</span><h2>Thanh toán nhanh chóng</h2><p>Hoàn tất thanh toán để nhận vé điện tử qua email và lưu trong tài khoản của bạn.</p><div class="secure-list"><span>✓ Xác nhận ngay lập tức</span><span>✓ Hỗ trợ MoMo, VNPay, Visa</span><span>✓ Hoàn tiền trước 24 giờ</span></div></aside></section><section class="guest-history panel"><div class="panel-head"><div><h2>Lịch sử thanh toán vé</h2><p>Các giao dịch gần đây của bạn</p></div><span class="collection-count">${db.guestPayments.length} giao dịch</span></div><div class="guest-history-head"><span>MÃ VÉ / NGÀY</span><span>NỘI DUNG</span><span>PHƯƠNG THỨC</span><span>SỐ TIỀN</span><span>TRẠNG THÁI</span></div><div id="guest-payment-rows">${guestPaymentRows()}</div></section><div class="booking-success" id="payment-success"><span>✓</span><div><strong>Thanh toán thành công!</strong><p>Vé điện tử <b id="paid-ticket-code"></b> đã được xác nhận.</p></div></div>`; }
function ticketCustomerRows(items) { return items.map(ticket => `<div class="ticket-customer-row"><div class="customer-cell"><span class="customer-avatar">${ticket.name.split(' ').map(part => part[0]).slice(-2).join('')}</span><div><strong>${ticket.name}</strong><small>${ticket.contact}</small></div></div><div><strong>${ticket.code}</strong><small>${ticket.date}</small></div><div class="ticket-exhibition-cell">${ticket.exhibition}</div><div>${ticket.quantity}</div><div><strong>${ticket.amount}</strong><small class="source ${ticket.source === 'Online' ? 'online' : 'counter'}">${ticket.source}</small></div><b class="paid-status">${ticket.status}</b></div>`).join(''); }
function ticketCustomersView() { const onlineCount = db.ticketCustomers.filter(ticket => ticket.source === 'Online').length; const counterCount = db.ticketCustomers.filter(ticket => ticket.source === 'Tại quầy').length; return `<section class="page-heading"><div><p class="eyebrow">QUẢN LÝ DOANH THU &amp; KHÁCH HÀNG</p><h1>Khách hàng &amp; vé</h1><p class="subtitle">Theo dõi toàn bộ vé online và vé bán trực tiếp tại quầy trong một nơi.</p></div><button class="primary-btn" data-action="counter-ticket">＋ Bán vé tại quầy</button></section><section class="stats-grid ticket-stats"><article class="stat-card"><div class="stat-top"><span>Tổng vé hôm nay</span><b class="trend up">↗ 14.2%</b></div><strong>186</strong><small>Online và tại quầy</small></article><article class="stat-card"><div class="stat-top"><span>Vé online</span><b class="trend up">${onlineCount} đơn</b></div><strong>124</strong><div class="stat-meta"><span class="mini-icon blue-bg">▣</span><small>67% tổng số vé</small></div></article><article class="stat-card"><div class="stat-top"><span>Vé tại quầy</span><b class="trend neutral">${counterCount} đơn mẫu</b></div><strong>62</strong><div class="stat-meta"><span class="mini-icon orange-bg">▤</span><small>33% tổng số vé</small></div></article><article class="stat-card accent"><div class="stat-top"><span>Doanh thu hôm nay</span><b class="trend up">↗ 9.8%</b></div><strong>14,8tr</strong><small>VNĐ · Đã thanh toán</small></article></section><section class="toolbar ticket-toolbar"><div class="search-box">⌕<input id="ticket-customer-search" placeholder="Tìm tên, mã vé, email..." /></div><button class="filter-btn ticket-filter active" data-ticket-filter="all">Tất cả</button><button class="filter-btn ticket-filter" data-ticket-filter="Online">Online</button><button class="filter-btn ticket-filter" data-ticket-filter="Tại quầy">Tại quầy</button><button class="select-btn">Hôm nay ⌄</button></section><div class="ticket-customer-table panel"><div class="ticket-customer-head"><span>KHÁCH HÀNG</span><span>MÃ VÉ / NGÀY</span><span>TRIỂN LÃM</span><span>SỐ LƯỢNG</span><span>THANH TOÁN</span><span>TRẠNG THÁI</span></div><div id="ticket-customer-rows">${ticketCustomerRows(db.ticketCustomers)}</div></div>`; }
function paymentRows(items) { return items.map(payment => `<div class="payment-row"><div class="payment-customer"><span class="customer-avatar">${payment.name.split(' ').map(part => part[0]).slice(-2).join('')}</span><div><strong>${payment.name}</strong><small>${payment.code}</small></div></div><div><strong>${payment.time.split(' · ')[0]}</strong><small>${payment.time.split(' · ')[1]}</small></div><span class="payment-source ${payment.source === 'Online' ? 'online' : 'counter'}">${payment.source}</span><span class="payment-method">${payment.method}</span><strong class="payment-amount ${payment.status === 'Đã hoàn tiền' ? 'refunded' : ''}">${payment.amount}</strong><b class="payment-status ${payment.status === 'Đã hoàn tiền' ? 'refunded' : ''}">${payment.status}</b></div>`).join(''); }
function paymentHistoryView() { return `<section class="page-heading"><div><p class="eyebrow">ĐỐI SOÁT TÀI CHÍNH</p><h1>Lịch sử nhận tiền</h1><p class="subtitle">Kiểm tra các khoản thanh toán vé online và tiền thu trực tiếp tại quầy.</p></div><button class="primary-btn" data-action="export-payment">↧ Xuất báo cáo</button></section><section class="stats-grid payment-stats"><article class="stat-card accent"><div class="stat-top"><span>Tổng đã nhận tháng này</span><b class="trend up">↗ 12.4%</b></div><strong>48,6tr</strong><small>VNĐ · 428 giao dịch</small></article><article class="stat-card"><div class="stat-top"><span>Thanh toán online</span><b class="trend up">68%</b></div><strong>33,1tr</strong><div class="stat-meta"><span class="mini-icon blue-bg">●</span><small>MoMo, VNPay, thẻ</small></div></article><article class="stat-card"><div class="stat-top"><span>Thu tại quầy</span><b class="trend neutral">32%</b></div><strong>15,5tr</strong><div class="stat-meta"><span class="mini-icon orange-bg">▤</span><small>Tiền mặt và thẻ</small></div></article><article class="stat-card"><div class="stat-top"><span>Đã hoàn tiền</span><b class="trend neutral">3 giao dịch</b></div><strong>240k</strong><small>VNĐ · Đang đối soát</small></article></section><section class="toolbar payment-toolbar"><div class="search-box">⌕<input id="payment-search" placeholder="Tìm tên khách, mã vé..." /></div><button class="filter-btn payment-filter active" data-payment-filter="all">Tất cả</button><button class="filter-btn payment-filter" data-payment-filter="Online">Online</button><button class="filter-btn payment-filter" data-payment-filter="Tại quầy">Tại quầy</button><button class="select-btn">Tháng này ⌄</button></section><div class="payment-table panel"><div class="payment-head"><span>KHÁCH HÀNG</span><span>THỜI GIAN</span><span>NGUỒN</span><span>PHƯƠNG THỨC</span><span>SỐ TIỀN</span><span>TRẠNG THÁI</span></div><div id="payment-rows">${paymentRows(db.payments)}</div></div>`; }

function genericView(view) { const data = { visitors: ['Khách tham quan', 'Theo dõi hành vi và trải nghiệm của khách tại bảo tàng.', '<div class="big-metrics"><div><small>Lượt khách tháng này</small><strong>28,460</strong><b class="trend up">↗ 18.6%</b></div><div><small>Thời gian tham quan TB</small><strong>86 phút</strong><b class="trend up">↗ 7.2%</b></div><div><small>Tỷ lệ quay lại</small><strong>32%</strong><b class="trend up">↗ 4.1%</b></div></div>'], analytics: ['Phân tích dữ liệu', 'Nhìn thấy những tín hiệu quan trọng phía sau mỗi lượt tham quan.', '<div class="analysis-layout"><div class="analysis-chart"><h2>Hiệu quả theo khu vực</h2><div class="bar-set"><span>Đông Sơn <i style="width:88%"></i><b>88%</b></span><span>Champa <i style="width:72%"></i><b>72%</b></span><span>Nguyễn <i style="width:61%"></i><b>61%</b></span><span>Gốm sứ <i style="width:45%"></i><b>45%</b></span></div></div><div class="recommendation"><span class="insight-orb small">✦</span><h3>MuseAI phát hiện</h3><p>Khu Đông Sơn có mức tương tác cao nhất. Nên ưu tiên nội dung audio guide tại đây.</p><button class="text-btn" data-view="ai">Khám phá thêm →</button></div></div>'], exhibitions: ['Triển lãm', 'Quản lý nội dung, tiến độ và hiệu quả của các không gian trưng bày.', `<div class="exhibition-grid">${db.exhibitions.map(e => `<article class="exhibition-card"><div class="exhibition-art ${e.color}">◫</div><div class="exhibition-info"><span class="label">ĐANG DIỄN RA</span><h2>${e.name}</h2><p>${e.date}</p><div class="progress-label"><span>${e.visitors} lượt khách</span><b>${e.progress}%</b></div><div class="progress"><i style="width:${e.progress}%"></i></div></div></article>`).join('')}</div>`], settings: ['Cài đặt hệ thống', 'Cấu hình tài khoản, quyền truy cập và kết nối dữ liệu.', '<div class="settings-list"><div><span class="setting-icon">♙</span><section><strong>Thông tin bảo tàng</strong><small>Tên, địa chỉ và thông tin liên hệ</small></section><b>›</b></div><div><span class="setting-icon">◉</span><section><strong>Người dùng &amp; phân quyền</strong><small>Quản lý 24 tài khoản đang hoạt động</small></section><b>›</b></div><div><span class="setting-icon sparkle">✦</span><section><strong>Cấu hình MuseAI</strong><small>MuseAI v2.4 · Độ chính xác 96.4%</small></section><b>›</b></div></div>'] }; const [title, sub, body] = data[view]; return `<section class="page-heading"><div><p class="eyebrow">MUSEA INSIGHTS</p><h1>${title}</h1><p class="subtitle">${sub}</p></div><button class="primary-btn" data-action="report">↧ Xuất báo cáo</button></section>${body}`; }

function aiView() { return `<section class="page-heading"><div><p class="eyebrow">TRÍ TUỆ NHÂN TẠO · ${new Date().toLocaleDateString('vi-VN')}</p><h1>Trợ lý <span class="ai-title">MuseAI</span></h1><p class="subtitle">Hỏi bất cứ điều gì về dữ liệu và bộ sưu tập của bảo tàng.</p></div><span class="ai-status"><i></i> MuseAI v2.4 đang hoạt động</span></section><section class="ai-layout"><div class="chat-panel panel"><div class="chat-header"><span class="ai-avatar">✦</span><div><strong>MuseAI Assistant</strong><small>Được huấn luyện trên dữ liệu bảo tàng</small></div><button>•••</button></div><div class="messages" id="messages"><div class="message bot"><span class="ai-avatar small">✦</span><div><p>Xin chào Hà! Tôi có thể giúp bạn phân tích hiện vật, dự đoán lượng khách hoặc tìm kiếm thông tin trong bộ sưu tập.</p><time>08:32</time></div></div><div class="suggestions"><button data-prompt="Hiện vật nào được tham quan nhiều nhất tháng này?">Hiện vật được quan tâm nhất?</button><button data-prompt="Dự đoán lượng khách cuối tuần này">Dự đoán lượng khách cuối tuần</button></div></div><form class="chat-input" id="chat-form"><input id="chat-text" placeholder="Đặt câu hỏi cho MuseAI..." autocomplete="off"/><button aria-label="Gửi">↑</button></form></div><aside class="ai-side"><div class="ai-side-card"><div class="side-head"><strong>AI Insights hôm nay</strong><span>⌁</span></div><div class="ai-side-item"><span class="bullet terracotta"></span><div><strong>Lượng khách tăng 28%</strong><small>Khung 14:00 — 16:00</small></div><b>›</b></div><div class="ai-side-item"><span class="bullet gold"></span><div><strong>4 hiện vật cần chú ý</strong><small>Độ ẩm phòng B cao hơn mức chuẩn</small></div><b>›</b></div><div class="ai-side-item"><span class="bullet green"></span><div><strong>Xu hướng khách trẻ</strong><small>Nhóm 18 — 24 tăng 16% tháng này</small></div><b>›</b></div></div><div class="model-card"><div><span class="sparkle">✦</span><strong>Độ tin cậy mô hình</strong></div><strong class="model-score">96.4%</strong><div class="progress"><i style="width:96.4%"></i></div><small>Cập nhật lần cuối 08:30 hôm nay</small></div></aside></section>`; }

function render(view = 'overview') { breadcrumb.textContent = titles[view]; pageContent.innerHTML = view === 'overview' ? overviewView() : view === 'collections' ? collectionsView() : view === 'artifact-info' ? artifactInfoView() : view === 'tickets' ? ticketsView() : view === 'guest-payments' ? guestPaymentsView() : view === 'ticket-customers' ? ticketCustomersView() : view === 'payment-history' ? paymentHistoryView() : view === 'ai' ? aiView() : genericView(view); document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.view === view)); bindInteractions(); }
function showToast(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }
function bindInteractions() { document.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => { render(btn.dataset.view); document.querySelector('.sidebar').classList.remove('open'); })); document.querySelectorAll('[data-action="report"]').forEach(btn => btn.addEventListener('click', () => showToast('Báo cáo đang được tạo và sẽ sẵn sàng trong giây lát.'))); document.querySelectorAll('[data-action="add"]').forEach(btn => btn.addEventListener('click', () => showToast('Đã mở biểu mẫu thêm hiện vật mới.'))); document.querySelectorAll('[data-action="counter-ticket"]').forEach(btn => btn.addEventListener('click', () => showToast('Đã mở biểu mẫu bán vé tại quầy.'))); document.querySelectorAll('[data-action="export-payment"]').forEach(btn => btn.addEventListener('click', () => showToast('Báo cáo lịch sử nhận tiền đang được xuất.'))); const search = document.getElementById('artifact-search'); if (search) search.addEventListener('input', e => { const query = e.target.value.toLowerCase(); document.getElementById('artifact-rows').innerHTML = artifactRows(db.artifacts.filter(a => `${a.name} ${a.id} ${a.category}`.toLowerCase().includes(query))); }); const publicSearch = document.getElementById('public-artifact-search'); if (publicSearch) publicSearch.addEventListener('input', e => { const query = e.target.value.toLowerCase(); document.getElementById('public-artifact-grid').innerHTML = publicArtifactCards(db.artifacts.filter(a => `${a.name} ${a.id} ${a.category} ${a.period} ${a.year}`.toLowerCase().includes(query))); }); bindTicketCustomerInteractions(); bindPaymentInteractions(); bindGuestPaymentInteractions(); document.querySelectorAll('[data-prompt]').forEach(btn => btn.addEventListener('click', () => { const input = document.getElementById('chat-text'); input.value = btn.dataset.prompt; input.focus(); })); const form = document.getElementById('chat-form'); if (form) form.addEventListener('submit', handleChat); bindTicketInteractions(); const mobileMenu = document.querySelector('.mobile-menu'); if (mobileMenu) mobileMenu.onclick = () => document.querySelector('.sidebar').classList.toggle('open'); }
function bindTicketCustomerInteractions() { const rows = document.getElementById('ticket-customer-rows'); if (!rows) return; let selectedFilter = 'all'; const updateRows = () => { const query = document.getElementById('ticket-customer-search').value.toLowerCase(); rows.innerHTML = ticketCustomerRows(db.ticketCustomers.filter(ticket => (selectedFilter === 'all' || ticket.source === selectedFilter) && `${ticket.name} ${ticket.code} ${ticket.contact} ${ticket.exhibition}`.toLowerCase().includes(query))); }; document.getElementById('ticket-customer-search').addEventListener('input', updateRows); document.querySelectorAll('.ticket-filter').forEach(button => button.addEventListener('click', () => { selectedFilter = button.dataset.ticketFilter === 'all' ? 'all' : button.dataset.ticketFilter; document.querySelectorAll('.ticket-filter').forEach(item => item.classList.toggle('active', item === button)); updateRows(); })); }
function bindPaymentInteractions() { const rows = document.getElementById('payment-rows'); if (!rows) return; let selectedFilter = 'all'; const updateRows = () => { const query = document.getElementById('payment-search').value.toLowerCase(); rows.innerHTML = paymentRows(db.payments.filter(payment => (selectedFilter === 'all' || payment.source === selectedFilter) && `${payment.name} ${payment.code} ${payment.method}`.toLowerCase().includes(query))); }; document.getElementById('payment-search').addEventListener('input', updateRows); document.querySelectorAll('.payment-filter').forEach(button => button.addEventListener('click', () => { selectedFilter = button.dataset.paymentFilter === 'all' ? 'all' : button.dataset.paymentFilter; document.querySelectorAll('.payment-filter').forEach(item => item.classList.toggle('active', item === button)); updateRows(); })); }
function bindGuestPaymentInteractions() { const form = document.getElementById('online-payment-form'); if (!form) return; let selectedMethod = 'MoMo'; const ticketSelect = document.getElementById('payment-ticket'); const updateAmount = () => { const amount = ticketSelect.value.split('|')[2]; document.querySelector('.ticket-submit').innerHTML = `Thanh toán ${amount} <span>→</span>`; }; document.querySelectorAll('.payment-method-option').forEach(button => button.addEventListener('click', () => { selectedMethod = button.dataset.method; document.querySelectorAll('.payment-method-option').forEach(item => item.classList.toggle('active', item === button)); })); ticketSelect.addEventListener('change', updateAmount); form.addEventListener('submit', event => { event.preventDefault(); const [exhibition, code, amount] = ticketSelect.value.split('|'); db.guestPayments.unshift({ code, exhibition, date: new Date().toLocaleDateString('vi-VN'), method: selectedMethod, amount, status: 'Đã thanh toán' }); document.getElementById('guest-payment-rows').innerHTML = guestPaymentRows(); document.getElementById('paid-ticket-code').textContent = code; document.getElementById('payment-success').classList.add('show'); showToast('Thanh toán vé online thành công.'); }); updateAmount(); }
function bindTicketInteractions() { const form = document.getElementById('ticket-form'); if (!form) return; const state = { adult: 1, child: 0 }; const updateSummary = () => { const exhibition = document.getElementById('ticket-exhibition').value; const date = document.getElementById('ticket-date').value; const slot = document.getElementById('ticket-slot').value; const totalPeople = state.adult + state.child; document.getElementById('adult-count').textContent = state.adult; document.getElementById('child-count').textContent = state.child; document.getElementById('summary-exhibition').textContent = exhibition; document.getElementById('summary-datetime').textContent = date ? `${new Date(`${date}T00:00:00`).toLocaleDateString('vi-VN')} · ${slot}` : 'Chọn ngày tham quan'; document.getElementById('summary-quantity').textContent = `${totalPeople} người (${state.adult} người lớn, ${state.child} trẻ em)`; document.getElementById('ticket-total').textContent = `${(state.adult * 80000 + state.child * 40000).toLocaleString('vi-VN')}đ`; }; document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => { const type = button.dataset.step; state[type] = Math.max(type === 'adult' ? 1 : 0, Math.min(10, state[type] + Number(button.dataset.delta))); updateSummary(); })); ['ticket-exhibition', 'ticket-date', 'ticket-slot'].forEach(id => document.getElementById(id).addEventListener('change', updateSummary)); const dateInput = document.getElementById('ticket-date'); dateInput.min = new Date().toISOString().split('T')[0]; form.addEventListener('submit', event => { event.preventDefault(); const code = `MUS-${Date.now().toString().slice(-6)}`; document.getElementById('booking-code').textContent = code; document.getElementById('booking-success').classList.add('show'); document.getElementById('booking-success').scrollIntoView({ behavior: 'smooth', block: 'center' }); showToast('Đã xác nhận đặt vé online.'); }); document.getElementById('new-booking').addEventListener('click', () => { document.getElementById('booking-success').classList.remove('show'); form.reset(); state.adult = 1; state.child = 0; updateSummary(); }); updateSummary(); }
function bindBookingPaymentBridge() { document.addEventListener('submit', event => { if (event.target.id === 'ticket-form') { if (!event.target.checkValidity()) return; event.preventDefault(); event.stopImmediatePropagation(); const code = `MUS-${Date.now().toString().slice(-6)}`; pendingTicket = { code, exhibition: document.getElementById('ticket-exhibition').value, amount: document.getElementById('ticket-total').textContent }; render('guest-payments'); const select = document.getElementById('payment-ticket'); const option = document.createElement('option'); option.value = `${pendingTicket.exhibition}|${pendingTicket.code}|${pendingTicket.amount}`; option.textContent = `${pendingTicket.code} · ${pendingTicket.exhibition} · ${pendingTicket.amount} · Chờ thanh toán`; select.prepend(option); select.value = option.value; select.dispatchEvent(new Event('change')); showToast('Đã giữ vé. Vui lòng hoàn tất thanh toán online.'); } else if (event.target.id === 'online-payment-form') { pendingTicket = null; } }, true); }
function handleChat(e) { e.preventDefault(); const input = document.getElementById('chat-text'); const value = input.value.trim(); if (!value) return; const messages = document.getElementById('messages'); messages.insertAdjacentHTML('beforeend', `<div class="message user"><div><p>${value}</p><time>Vừa xong</time></div></div>`); input.value = ''; setTimeout(() => { messages.insertAdjacentHTML('beforeend', `<div class="message bot"><span class="ai-avatar small">✦</span><div><p>Dựa trên dữ liệu hiện có, tôi nhận thấy <b>Trống đồng Ngọc Lũ</b> đang có mức tương tác cao nhất với 1.842 lượt xem trong tháng này. Tôi có thể phân tích sâu hơn theo nhóm khách hoặc khung giờ.</p><time>Vừa xong</time></div></div>`); messages.scrollTop = messages.scrollHeight; }, 500); }
function logout() {
  currentUser = null;
  document.getElementById('login-form').reset();
  document.getElementById('register-form').reset();
  document.getElementById('login-error').textContent = '';
  document.getElementById('register-error').textContent = '';
  switchAuthForm('login');
  showAuth();
}
document.getElementById('logout-button').addEventListener('click', logout);
document.getElementById('sidebar-logout').addEventListener('click', logout);
bindAuth();
bindBookingPaymentBridge();
showAuth();