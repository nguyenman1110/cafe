/* ============================================================
   Cà phê Gốc Đa — POS System — app.js
   Full rewrite with Table Management + Search + Discount + Payment QR
============================================================ */

// ── Constants ──────────────────────────────────────────────
const STORAGE_PRODUCTS = 'cafe_products_v2';
const STORAGE_TRANSACTIONS = 'cafe_transactions_v2';
const STORAGE_TABLES = 'cafe_tables_v2';
const POS_PASSWORD = 'man123';
const DEFAULT_TABLE_COUNT = 8;

// QR Bank config (VietQR)
const BANK_ID = '970422'; // MB Bank
const ACCOUNT_NO = '1234567890'; // <<< ĐỔI SỐ TÀI KHOẢN TẠI ĐÂY
const ACCOUNT_NAME = 'CA PHE GOC DA';

const CATEGORY_META = {
    'Trà': { color: 'green', en: 'Tea', icon: '🍵' },
    'Trà sữa': { color: 'teal', en: 'Milk Tea', icon: '🧋' },
    'Nước ngọt': { color: 'blue', en: 'Soft Drinks', icon: '🥤' },
    'Đồ có cồn': { color: 'red', en: 'Alcohol', icon: '🍺' },
    'Thuốc lá': { color: 'purple', en: 'Cigarettes', icon: '🚬' },
    'Đồ ăn': { color: 'orange', en: 'Snacks', icon: '🐟' },
    'Hướng dương': { color: 'yellow', en: 'Sunflower Seeds', icon: '🌻' },
    'Topping': { color: 'pink', en: 'Toppings', icon: '🧊' }
};
const CATEGORIES = ['Tất cả', ...Object.keys(CATEGORY_META)];

// ── Default Products ────────────────────────────────────────
const DEFAULT_PRODUCTS = [
    // ── Trà ──────────────────────────────────────────────────
    { id: 1, name: 'Trà đá', icon: '🧊', price: 5000, category: 'Trà', stock: 100 },
    { id: 2, name: 'Trà quất', icon: '🍋', price: 10000, category: 'Trà', stock: 100 },
    { id: 3, name: 'Nhân trần', icon: '🌿', price: 5000, category: 'Trà', stock: 100 },
    { id: 4, name: 'Trà Việt quất', icon: '🫐', price: 0, category: 'Trà', stock: 100 },
    { id: 5, name: 'Trà chanh leo hạt đá', icon: '🍈', price: 0, category: 'Trà', stock: 100 },
    { id: 6, name: 'Trà dâu tằm', icon: '🍓', price: 0, category: 'Trà', stock: 100 },
    { id: 7, name: 'Trà bí đao sương sáo', icon: '🍵', price: 0, category: 'Trà', stock: 100 },
    // ── Trà sữa ──────────────────────────────────────────────
    { id: 8, name: 'Trà sữa matcha', icon: '🍵', price: 0, category: 'Trà sữa', stock: 100 },
    { id: 9, name: 'Trà sữa Phúc Long', icon: '🧋', price: 0, category: 'Trà sữa', stock: 100 },
    { id: 10, name: 'Trà sữa trân châu đường đen', icon: '🟤', price: 0, category: 'Trà sữa', stock: 100 },
    // ── Nước ngọt ────────────────────────────────────────────
    { id: 11, name: 'Sting đỏ', icon: '🔴', price: 15000, category: 'Nước ngọt', stock: 100 },
    { id: 12, name: 'Sting vàng', icon: '⚡', price: 15000, category: 'Nước ngọt', stock: 100 },
    { id: 13, name: 'Bò húc', icon: '🐂', price: 18000, category: 'Nước ngọt', stock: 100 },
    { id: 14, name: 'C2 to', icon: '🍃', price: 15000, category: 'Nước ngọt', stock: 100 },
    { id: 15, name: 'C2 nhỡ', icon: '🍃', price: 10000, category: 'Nước ngọt', stock: 100 },
    { id: 16, name: 'Revive vàng', icon: '💛', price: 15000, category: 'Nước ngọt', stock: 100 },
    { id: 17, name: 'Revive trắng', icon: '🤍', price: 15000, category: 'Nước ngọt', stock: 100 },
    { id: 18, name: 'Cam lon', icon: '🍊', price: 15000, category: 'Nước ngọt', stock: 100 },
    { id: 19, name: 'Coca', icon: '🥤', price: 10000, category: 'Nước ngọt', stock: 100 },
    { id: 20, name: 'Bon cha', icon: '🧃', price: 15000, category: 'Nước ngọt', stock: 100 },
    { id: 21, name: 'Cà phê nâu', icon: '☕', price: 25000, category: 'Nước ngọt', stock: 100 },
    { id: 22, name: 'Nước mía', icon: '🌾', price: 0, category: 'Nước ngọt', stock: 100 },
    { id: 23, name: 'Nước dừa', icon: '🥥', price: 0, category: 'Nước ngọt', stock: 100 },
    // ── Đồ có cồn ────────────────────────────────────────────
    { id: 24, name: 'Bia 333', icon: '🍺', price: 20000, category: 'Đồ có cồn', stock: 100 },
    { id: 25, name: 'Bia Sài Gòn', icon: '🍻', price: 20000, category: 'Đồ có cồn', stock: 100 },
    // ── Thuốc lá ─────────────────────────────────────────────
    { id: 26, name: 'Thăng long cứng', icon: '🚬', price: 20000, category: 'Thuốc lá', stock: 100 },
    { id: 27, name: 'Thăng long mềm', icon: '🚬', price: 18000, category: 'Thuốc lá', stock: 100 },
    { id: 28, name: 'Thuốc Vina', icon: '🚬', price: 25000, category: 'Thuốc lá', stock: 100 },
    // ── Đồ ăn ────────────────────────────────────────────────
    { id: 29, name: 'Cá bóng', icon: '🐡', price: 15000, category: 'Đồ ăn', stock: 100 },
    { id: 30, name: 'Cá chỉ vàng', icon: '🐟', price: 5000, category: 'Đồ ăn', stock: 100 },
    // ── Hướng dương ──────────────────────────────────────────
    { id: 31, name: 'Hướng dương truyền thống', icon: '🌻', price: 10000, category: 'Hướng dương', stock: 100 },
    { id: 32, name: 'Hướng dương vị dừa', icon: '🌴', price: 12000, category: 'Hướng dương', stock: 100 },
    // ── Topping ──────────────────────────────────────────────
    { id: 33, name: 'Nha đam', icon: '🌵', price: 0, category: 'Topping', stock: 100 },
    { id: 34, name: 'Trân châu trắng', icon: '🫧', price: 0, category: 'Topping', stock: 100 }
].map(p => ({ image: '', ...p, icon: p.icon || (CATEGORY_META[p.category] || {}).icon || '📦' }));

// ── Helpers ─────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const fmt = n => Number(n || 0).toLocaleString('vi-VN') + ' đ';
const todayStr = () => new Date().toLocaleDateString('vi-VN');

// ── Storage ──────────────────────────────────────────────────
function loadProducts() {
    try {
        const s = localStorage.getItem(STORAGE_PRODUCTS);
        if (s) return JSON.parse(s).map(p => ({
            ...p,
            stock: p.stock ?? 100,
            icon: p.icon || (CATEGORY_META[p.category] || {}).icon || '📦',
            image: p.image || ''
        }));
    } catch (e) { }
    return DEFAULT_PRODUCTS.map(p => ({ ...p }));
}
function saveProducts() { localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products)); }

function loadTransactions() {
    try { const s = localStorage.getItem(STORAGE_TRANSACTIONS); if (s) return JSON.parse(s); } catch (e) { }
    return [];
}
function saveTransactions() { localStorage.setItem(STORAGE_TRANSACTIONS, JSON.stringify(transactions)); }

function loadTables() {
    try {
        const s = localStorage.getItem(STORAGE_TABLES);
        if (s) {
            const data = JSON.parse(s);
            Object.values(data).forEach(t => { if (!Array.isArray(t.cart)) t.cart = []; });
            return data;
        }
    } catch (e) { }
    const t = {};
    for (let i = 1; i <= DEFAULT_TABLE_COUNT; i++) {
        t[i] = { id: i, name: `Bàn ${i}`, cart: [] };
    }
    return t;
}
function saveTables() { localStorage.setItem(STORAGE_TABLES, JSON.stringify(tables)); }

// ── State ────────────────────────────────────────────────────
let products = loadProducts();
let transactions = loadTransactions();
let tables = loadTables();
let currentTableId = Object.keys(tables)[0] ? Number(Object.keys(tables)[0]) : 1;
let currentCategory = 'Tất cả';
let editingProductId = null;
let searchKeyword = '';
let selectedPayMethod = 'cash'; // 'cash' | 'qr'
let revenueUnlocked = false;

function currentCart() { return tables[currentTableId]?.cart || []; }

// ── Navigation ───────────────────────────────────────────────
window.switchTab = function (tabId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const nav = $('nav-' + tabId); if (nav) nav.classList.add('active');
    document.querySelectorAll('.tab-view').forEach(el => el.classList.remove('active'));
    const view = $('view-' + tabId); if (view) view.classList.add('active');
    if (tabId === 'history') renderHistory();
    if (tabId === 'products') renderManagementGrid();
    if (tabId === 'menu') renderMenu();
    if (tabId === 'pos') { renderTableBar(); renderCategoryTabs(); renderProducts(); renderCart(); }
};

// ── Table Management ─────────────────────────────────────────
function renderTableBar() {
    const bar = $('table-bar');
    if (!bar) return;

    const tableButtons = Object.values(tables).map(t => {
        const itemCount = t.cart.reduce((s, i) => s + i.quantity, 0);
        const hasItems = t.cart.length > 0;
        const isCurrent = t.id === currentTableId;
        const classes = ['table-btn', isCurrent ? 'current' : '', hasItems ? 'has-items' : ''].filter(Boolean).join(' ');
        const badge = hasItems ? `<span class="table-badge">${itemCount}</span>` : '';
        return `<div class="table-btn-wrap ${isCurrent ? 'active-wrap' : ''}" onclick="selectTable(${t.id})">
            ${badge}
            <span class="table-icon">🪑</span>
            <span class="table-label">${t.name}</span>
            <button class="table-rename-btn" onclick="event.stopPropagation(); openRenameModal(${t.id})" title="Đổi tên bàn">✏️</button>
        </div>`;
    }).join('');

    bar.innerHTML = tableButtons + `<button class="add-table-btn" onclick="addTable()" title="Thêm bàn">＋</button>`;


    const nameEl = $('cart-table-name');
    if (nameEl) nameEl.textContent = tables[currentTableId]?.name || 'Bàn';

    const activeCount = $('active-tables-count');
    if (activeCount) activeCount.textContent = Object.values(tables).filter(t => t.cart.length > 0).length;
}

window.selectTable = function (id) {
    saveTables();
    currentTableId = id;
    renderTableBar();
    renderCart();
};

window.addTable = function () {
    const ids = Object.keys(tables).map(Number);
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    tables[newId] = { id: newId, name: `Bàn ${newId}`, cart: [] };
    saveTables();
    currentTableId = newId;
    renderTableBar();
    renderCart();
};

window.showActiveOrders = function () {
    const active = Object.values(tables).filter(t => t.cart.length > 0);
    if (active.length === 0) { alert('Hiện không có bàn nào đang có đơn.'); return; }
    const list = active.map(t => {
        const total = t.cart.reduce((s, i) => s + i.price * i.quantity, 0);
        const items = t.cart.reduce((s, i) => s + i.quantity, 0);
        return `${t.name}: ${items} món — ${fmt(total)}`;
    }).join('\n');
    alert(`Bàn đang có đơn:\n\n${list}`);
};

// ── Search ───────────────────────────────────────────────────
window.onSearchInput = function () {
    const input = $('product-search');
    if (!input) return;
    searchKeyword = input.value.trim().toLowerCase();
    const clearBtn = $('search-clear-btn');
    if (clearBtn) clearBtn.style.display = searchKeyword ? 'flex' : 'none';
    renderProducts();
};

window.clearSearch = function () {
    const input = $('product-search');
    if (input) input.value = '';
    searchKeyword = '';
    const clearBtn = $('search-clear-btn');
    if (clearBtn) clearBtn.style.display = 'none';
    renderProducts();
};

// ── Category Tabs ─────────────────────────────────────────────
function renderCategoryTabs() {
    const el = $('category-tabs'); if (!el) return;
    el.innerHTML = CATEGORIES.map(cat =>
        `<div class="cat-tab ${cat === currentCategory ? 'active' : ''}"
              onclick="setCategory('${cat.replace(/'/g, "\\'")}')">
            ${cat}
        </div>`
    ).join('');
}

window.setCategory = function (cat) {
    currentCategory = cat;
    renderCategoryTabs();
    renderProducts();
};

// ── Product Grid ──────────────────────────────────────────────
function renderProducts() {
    const grid = $('product-grid'); if (!grid) return;

    let list = currentCategory === 'Tất cả'
        ? products
        : products.filter(p => p.category === currentCategory);

    // Apply search filter
    if (searchKeyword) {
        list = list.filter(p => p.name.toLowerCase().includes(searchKeyword));
    }

    if (list.length === 0) {
        const msg = searchKeyword
            ? `Không tìm thấy "<strong>${searchKeyword}</strong>"`
            : 'Không có sản phẩm.';
        grid.innerHTML = `<p style="color:var(--text-muted);padding:24px;grid-column:1/-1;">${msg}</p>`;
        return;
    }
    grid.innerHTML = list.map(p => {
        const soldOut = p.stock <= 0;
        const imgHtml = p.image
            ? `<img src="${p.image}" alt="${p.name}" class="product-image">`
            : `<div class="product-image-placeholder">${p.icon}</div>`;
        return `<div class="product-card" onclick="addToCart(${p.id})"
                     style="${soldOut ? 'opacity:.4;pointer-events:none;' : ''}">
            ${imgHtml}
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
                    <div class="product-price">${fmt(p.price)}</div>
                    <div style="font-size:11px;font-weight:700;
                         color:${p.stock <= 5 ? '#ef4444' : 'var(--text-muted)'};">
                        SL: ${p.stock}
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ── Cart ──────────────────────────────────────────────────────
window.addToCart = function (productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const table = tables[currentTableId];
    if (!table) return;
    const existing = table.cart.find(i => i.id === productId);
    const qty = existing ? existing.quantity : 0;
    if (qty >= product.stock) {
        alert(`${product.name} chỉ còn ${product.stock} trong kho!`);
        return;
    }
    if (existing) { existing.quantity += 1; }
    else { table.cart.push({ id: product.id, name: product.name, price: product.price, icon: product.icon, quantity: 1 }); }
    saveTables();
    renderCart();
    renderTableBar();
};

window.updateQuantity = function (id, delta) {
    const table = tables[currentTableId]; if (!table) return;
    const item = table.cart.find(i => i.id === id); if (!item) return;
    const prod = products.find(p => p.id === id);
    if (delta > 0 && prod && item.quantity >= prod.stock) {
        alert(`Không thể thêm quá tồn kho (${prod.stock}).`);
        return;
    }
    item.quantity += delta;
    if (item.quantity <= 0) table.cart = table.cart.filter(i => i.id !== id);
    saveTables();
    renderCart();
    renderTableBar();
};

function renderCart() {
    const container = $('cart-items-container');
    const emptyMsg = $('empty-cart-msg');
    const totalEl = $('cart-total');
    const btn = $('checkout-btn');
    const nameEl = $('cart-table-name');
    if (!container) return;

    const cart = currentCart();
    if (nameEl) nameEl.textContent = tables[currentTableId]?.name || 'Bàn';

    if (cart.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
        Array.from(container.children).forEach(c => {
            if (c.id !== 'empty-cart-msg') c.remove();
        });
        if (totalEl) totalEl.textContent = '0 đ';
        if (btn) { btn.disabled = true; btn.style.opacity = '.5'; }
        return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';
    Array.from(container.children).forEach(c => {
        if (c.id !== 'empty-cart-msg') c.remove();
    });

    const frag = document.createDocumentFragment();
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-name">${item.icon} ${item.name}</div>
                <div class="cart-item-price">${fmt(item.price)}</div>
                <div class="quantity-control">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span style="font-weight:700;min-width:20px;text-align:center;">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div style="font-weight:800;white-space:nowrap;padding-top:4px;">${fmt(item.price * item.quantity)}</div>`;
        frag.appendChild(div);
    });
    container.appendChild(frag);

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    if (totalEl) totalEl.textContent = fmt(total);
    if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
}

// ── Checkout Modal ────────────────────────────────────────────
const checkoutBtnEl = $('checkout-btn');
if (checkoutBtnEl) {
    checkoutBtnEl.addEventListener('click', () => {
        const cart = currentCart();
        if (cart.length === 0) return;

        const tableName = tables[currentTableId]?.name || 'Bàn';
        const titleEl = $('checkout-modal-title');
        if (titleEl) titleEl.textContent = `Thanh toán ${tableName}`;

        // Reset discount & method
        const discountInput = $('checkout-discount');
        if (discountInput) discountInput.value = '0';
        selectedPayMethod = 'cash';
        updatePayMethodUI();

        // Render items summary
        renderCheckoutSummary(cart);
        updateCheckoutTotal();

        $('checkout-modal').classList.add('active');
    });
}

function renderCheckoutSummary(cart) {
    const el = $('checkout-items-summary');
    if (!el) return;
    el.innerHTML = cart.map(item => `
        <div class="co-item-row">
            <span class="co-item-name">${item.icon} ${item.name} × ${item.quantity}</span>
            <span class="co-item-total">${fmt(item.price * item.quantity)}</span>
        </div>`).join('');
}

window.updateCheckoutTotal = function () {
    const cart = currentCart();
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const discount = Math.max(0, parseInt($('checkout-discount')?.value || 0) || 0);
    const final = Math.max(0, subtotal - discount);

    const subEl = $('checkout-subtotal');
    const finEl = $('checkout-modal-total');
    if (subEl) subEl.textContent = fmt(subtotal);
    if (finEl) finEl.textContent = fmt(final);

    // Update QR if visible
    if (selectedPayMethod === 'qr') updateQRCode(final);
    const qrAmt = $('qr-amount-display');
    if (qrAmt) qrAmt.textContent = fmt(final);
};

// ── Payment method selector ───────────────────────────────────
window.selectPayMethod = function (method) {
    selectedPayMethod = method;
    updatePayMethodUI();
};

function updatePayMethodUI() {
    const cashBtn = $('pay-cash-btn');
    const qrBtn = $('pay-qr-btn');
    const qrSec = $('qr-section');

    if (cashBtn) cashBtn.classList.toggle('active', selectedPayMethod === 'cash');
    if (qrBtn) qrBtn.classList.toggle('active', selectedPayMethod === 'qr');

    if (qrSec) {
        if (selectedPayMethod === 'qr') {
            qrSec.style.display = 'block';
            const cart = currentCart();
            const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
            const discount = Math.max(0, parseInt($('checkout-discount')?.value || 0) || 0);
            const final = Math.max(0, subtotal - discount);
            updateQRCode(final);
            const qrAmt = $('qr-amount-display');
            if (qrAmt) qrAmt.textContent = fmt(final);
        } else {
            qrSec.style.display = 'none';
        }
    }
}

function updateQRCode(amount) {
    // VietQR URL format
    const amountCents = Math.round(amount);
    const memo = encodeURIComponent(`Thanh toan Ca phe Goc Da`);
    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amountCents}&addInfo=${memo}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
    const img = $('qr-code-img');
    if (img) img.src = qrUrl;
}

window.closeCheckoutModal = function () {
    $('checkout-modal').classList.remove('active');
};

window.saveAndSwitch = function () {
    $('checkout-modal').classList.remove('active');
    alert(`Đã bảo lưu đơn cho ${tables[currentTableId]?.name}.\nNhấn vào bàn khác trên thanh bàn để chuyển đơn.`);
};

window.confirmCheckout = function () {
    $('checkout-modal').classList.remove('active');
    const table = tables[currentTableId];
    if (!table) return;
    const cart = [...table.cart];
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const discount = Math.max(0, parseInt($('checkout-discount')?.value || 0) || 0);
    const total = Math.max(0, subtotal - discount);

    // Deduct stock
    cart.forEach(item => {
        const p = products.find(x => x.id === item.id);
        if (p) p.stock = Math.max(0, p.stock - item.quantity);
    });

    // Record transaction (with payment method)
    transactions.push({
        id: Date.now(),
        timestamp: new Date().toLocaleString('vi-VN'),
        table: table.name,
        items: cart,
        subtotal,
        discount,
        total,
        payMethod: selectedPayMethod   // 'cash' | 'qr'
    });

    // Clear table cart
    table.cart = [];

    saveProducts();
    saveTransactions();
    saveTables();

    // Feedback
    const btn = $('checkout-btn');
    if (btn) { btn.innerHTML = '<span>✓ Thành công!</span>'; btn.style.background = 'var(--primary)'; }
    setTimeout(() => {
        renderCart();
        renderTableBar();
        renderProducts();
        updateStats();
        if (btn) {
            btn.innerHTML = '<span>Thanh toán</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
            btn.style.background = 'var(--secondary)';
        }
    }, 1400);
};

const clearCartBtn = $('clear-cart');
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        const table = tables[currentTableId]; if (!table) return;
        if (table.cart.length === 0) return;
        if (!confirm(`Xóa tất cả món của ${table.name}?`)) return;
        table.cart = [];
        saveTables();
        renderCart();
        renderTableBar();
    });
}

// ── Stats ─────────────────────────────────────────────────────
function updateStats() {
    const today = todayStr();
    const todays = transactions.filter(t => t.timestamp && t.timestamp.includes(today));
    const revenue = todays.reduce((s, t) => s + t.total, 0);
    const count = todays.length;

    const oc = $('order-count'); if (oc) oc.textContent = count;
    const hc = $('history-order-count'); if (hc) hc.textContent = count;
    const rv = $('history-revenue-val'); if (rv) rv.textContent = fmt(revenue);
    const at = $('active-tables-count');
    if (at) at.textContent = Object.values(tables).filter(t => t.cart.length > 0).length;
}

// ── History ───────────────────────────────────────────────────
function getFilteredTransactions() {
    const dateInput = $('history-date-filter');
    if (!dateInput || !dateInput.value) {
        // Default: today
        const today = todayStr();
        return transactions.filter(t => t.timestamp && t.timestamp.includes(today));
    }
    // Parse selected date to vi-VN format for matching
    const [y, m, d] = dateInput.value.split('-');
    const viDate = `${parseInt(d)}/${parseInt(m)}/${y}`;
    return transactions.filter(t => t.timestamp && t.timestamp.includes(viDate));
}

function renderHistory() {
    const list = $('history-list'); if (!list) return;

    // Set default date filter to today if empty
    const dateInput = $('history-date-filter');
    if (dateInput && !dateInput.value) {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
    updateStats();

    const filtered = getFilteredTransactions();
    const count = filtered.length;
    const revenue = filtered.reduce((s, t) => s + (t.total || 0), 0);
    const avgOrder = count > 0 ? Math.round(revenue / count) : 0;

    const cashTxns = filtered.filter(t => t.payMethod !== 'qr');
    const qrTxns = filtered.filter(t => t.payMethod === 'qr');
    const cashAmt = cashTxns.reduce((s, t) => s + (t.total || 0), 0);
    const qrAmt = qrTxns.reduce((s, t) => s + (t.total || 0), 0);

    // Update counters
    const hc = $('history-order-count'); if (hc) hc.textContent = count;

    if (revenueUnlocked) {
        // Revenue value
        const rv = $('history-revenue-val'); if (rv) rv.textContent = fmt(revenue);

        // KPI
        const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
        set('kpi-total-orders', count);
        set('kpi-revenue', fmt(revenue));
        set('kpi-avg-order', fmt(avgOrder));
        set('kpi-cash-count', `${cashTxns.length} đơn`);
        set('kpi-cash-amount', fmt(cashAmt));
        set('kpi-qr-count', `${qrTxns.length} đơn`);
        set('kpi-qr-amount', fmt(qrAmt));

        // Payment bar
        const total = cashAmt + qrAmt;
        const cashPct = total > 0 ? Math.round(cashAmt / total * 100) : 50;
        const qrPct = 100 - cashPct;
        const pCash = $('pbar-cash'); if (pCash) { pCash.style.width = cashPct + '%'; pCash.textContent = cashPct > 12 ? `💵 ${cashPct}%` : ''; }
        const pQr = $('pbar-qr'); if (pQr) { pQr.style.width = qrPct + '%'; pQr.textContent = qrPct > 12 ? `📱 ${qrPct}%` : ''; }

        // Top products
        renderTopProducts(filtered);
    }

    // Transaction list
    if (filtered.length === 0) {
        list.innerHTML = '<div class="txn-empty"><div style="font-size:40px;">🧾</div><div>Không có giao dịch nào trong ngày này.</div></div>';
        return;
    }

    list.innerHTML = filtered.slice().reverse().map(t => {
        const isQr = t.payMethod === 'qr';
        const itemCount = (t.items || []).reduce((s, i) => s + i.quantity, 0);
        const itemNames = (t.items || []).slice(0, 2).map(i => `${i.icon || ''} ${i.name}`).join(', ');
        const moreCount = (t.items || []).length > 2 ? ` +${(t.items || []).length - 2} món khác` : '';
        const discount = t.discount > 0 ? `<span class="txn-discount-tag">-${fmt(t.discount)}</span>` : '';
        return `
        <div class="txn-card" onclick="openTxnDetail('${t.id}')">
            <div class="txn-card-left">
                <div class="txn-card-time">${t.timestamp}</div>
                <div class="txn-card-table">🪱 ${t.table || '—'}</div>
                <div class="txn-card-items">${itemNames}${moreCount}</div>
            </div>
            <div class="txn-card-right">
                <div class="txn-card-amount">${fmt(t.total)}</div>
                ${discount}
                <span class="pay-badge pay-badge-${isQr ? 'qr' : 'cash'}" style="margin-top:4px;">${isQr ? '📱 CK' : '💵 TM'}</span>
                <div class="txn-card-items-count">${itemCount} món</div>
                <div class="txn-card-chevron">›</div>
            </div>
        </div>`;
    }).join('');
}

function renderTopProducts(txns) {
    const grid = $('top-products-grid'); if (!grid) return;

    // Aggregate sold quantities per product
    const map = {};
    txns.forEach(t => {
        (t.items || []).forEach(item => {
            if (!map[item.name]) map[item.name] = { name: item.name, icon: item.icon || '🍵', qty: 0, revenue: 0 };
            map[item.name].qty += item.quantity;
            map[item.name].revenue += item.price * item.quantity;
        });
    });
    const sorted = Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 6);

    if (sorted.length === 0) {
        grid.innerHTML = '<div style="color:var(--text-muted);font-size:14px;padding:8px;">Không có dữ liệu.</div>';
        return;
    }

    const maxQty = sorted[0].qty || 1;
    const medals = ['🥇', '🥈', '🥉'];

    grid.innerHTML = sorted.map((p, i) => `
        <div class="top-product-card">
            <div class="top-product-rank">${medals[i] || `#${i + 1}`}</div>
            <div class="top-product-icon">${p.icon}</div>
            <div class="top-product-name">${p.name}</div>
            <div class="top-product-bar-wrap">
                <div class="top-product-bar" style="width:${Math.round(p.qty / maxQty * 100)}%"></div>
            </div>
            <div class="top-product-stats">
                <span class="top-product-qty">${p.qty} ly</span>
                <span class="top-product-rev">${fmt(p.revenue)}</span>
            </div>
        </div>`).join('');
}

window.requestRevenuePassword = function () {
    const pwd = prompt('Nhập mật khẩu để xem doanh thu:');
    if (pwd === POS_PASSWORD) {
        revenueUnlocked = true;
        const btn = $('revenue-unlock-btn'); if (btn) btn.style.display = 'none';
        const wrap = $('revenue-val-wrap'); if (wrap) wrap.style.display = 'flex';
        const kpi = $('history-kpi-section'); if (kpi) kpi.style.display = 'block';
        renderHistory();
    } else if (pwd !== null) {
        alert('Mật khẩu không đúng!');
    }
};

window.lockRevenue = function () {
    revenueUnlocked = false;
    const btn = $('revenue-unlock-btn'); if (btn) btn.style.display = 'inline-flex';
    const wrap = $('revenue-val-wrap'); if (wrap) wrap.style.display = 'none';
    const kpi = $('history-kpi-section'); if (kpi) kpi.style.display = 'none';
};

// ── Transaction Detail ────────────────────────────────────────
window.openTxnDetail = function (txnId) {
    const t = transactions.find(x => String(x.id) === String(txnId));
    if (!t) return;

    const isQr = t.payMethod === 'qr';
    const badge = $('txn-detail-badge');
    const title = $('txn-detail-title');
    const meta = $('txn-detail-meta');
    const items = $('txn-detail-items');
    const summ = $('txn-detail-summary');

    if (badge) {
        badge.textContent = isQr ? '📱 Chuyển khoản QR' : '💵 Tiền mặt';
        badge.className = 'txn-detail-badge ' + (isQr ? 'badge-qr' : 'badge-cash');
    }
    if (title) title.textContent = t.table || 'Giao dịch';
    if (meta) meta.textContent = t.timestamp;

    if (items) {
        items.innerHTML = (t.items || []).map((item, i) => `
            <div class="txn-detail-item">
                <span class="txn-detail-item-num">${i + 1}</span>
                <span class="txn-detail-item-icon">${item.icon || '🍼'}</span>
                <span class="txn-detail-item-name">${item.name}</span>
                <span class="txn-detail-item-qty">× ${item.quantity}</span>
                <span class="txn-detail-item-price">${fmt(item.price * item.quantity)}</span>
            </div>`).join('');
    }

    if (summ) {
        const subtot = t.subtotal ?? t.total;
        const disc = t.discount ?? 0;
        summ.innerHTML = `
            <div class="txn-summ-row">
                <span>Tạm tính</span>
                <span>${fmt(subtot)}</span>
            </div>
            ${disc > 0 ? `<div class="txn-summ-row txn-summ-discount">
                <span>🎁 Giảm giá</span>
                <span>- ${fmt(disc)}</span>
            </div>` : ''}
            <div class="txn-summ-row txn-summ-total">
                <span>Thành tiền</span>
                <span>${fmt(t.total)}</span>
            </div>`;
    }

    $('txn-detail-modal').classList.add('active');
};

window.closeTxnDetail = function () {
    $('txn-detail-modal').classList.remove('active');
};

// ── Rename Table ──────────────────────────────────────────────
let renamingTableId = null;

window.openRenameModal = function (tableId) {
    renamingTableId = tableId;
    const table = tables[tableId];
    if (!table) return;
    const input = $('rename-table-input');
    if (input) { input.value = table.name; }
    $('rename-table-modal').classList.add('active');
    setTimeout(() => { if (input) input.focus(); }, 100);
};

window.confirmRenameTable = function () {
    const input = $('rename-table-input');
    const newName = input?.value.trim();
    if (!newName) { alert('Tên bàn không được để trống.'); return; }
    if (!tables[renamingTableId]) return;
    tables[renamingTableId].name = newName;
    saveTables();
    closeRenameModal();
    renderTableBar();
    renderCart();
};

window.closeRenameModal = function () {
    $('rename-table-modal').classList.remove('active');
    renamingTableId = null;
};

// ── Product Management ────────────────────────────────────────
function getIconForCategory(cat) { return (CATEGORY_META[cat] || {}).icon || '📦'; }

function renderManagementGrid() {
    const list = $('management-product-list'); if (!list) return;
    if (products.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:32px;color:var(--text-muted);">Chưa có sản phẩm.</div>';
        return;
    }
    list.innerHTML = products.map(p => `
        <div class="data-row" style="grid-template-columns:1fr 1fr 1fr 80px 140px;">
            <span style="font-weight:700;">${p.icon} ${p.name}</span>
            <span>${p.category}</span>
            <span>${fmt(p.price)}</span>
            <span style="font-weight:700;color:${p.stock <= 5 ? '#ef4444' : 'inherit'};">${p.stock}</span>
            <div style="display:flex;gap:6px;">
                <button class="btn btn-secondary" style="padding:6px 12px;font-size:13px;" onclick="editProduct(${p.id})">Sửa</button>
                <button class="btn btn-secondary" style="padding:6px 12px;font-size:13px;color:#ef4444;" onclick="deleteProduct(${p.id})">Xóa</button>
            </div>
        </div>`).join('');
}

window.showAddProductForm = function () {
    editingProductId = null;
    clearForm();
    const btn = $('save-product-btn'); if (btn) btn.textContent = 'Thêm sản phẩm';
    const fc = $('product-form-container');
    if (fc) { fc.style.display = 'block'; fc.scrollIntoView({ behavior: 'smooth' }); }
};

window.hideProductForm = function () {
    const fc = $('product-form-container'); if (fc) fc.style.display = 'none';
    editingProductId = null;
};

window.saveProduct = function () {
    const name = ($('p-name') || {}).value?.trim();
    const price = parseFloat(($('p-price') || {}).value);
    const cat = ($('p-category') || {}).value;
    const stock = parseInt(($('p-stock') || {}).value) || 0;

    if (!name) { alert('Vui lòng nhập tên sản phẩm.'); return; }
    if (isNaN(price)) { alert('Vui lòng nhập giá hợp lệ.'); return; }

    const icon = getIconForCategory(cat);

    if (editingProductId !== null) {
        const idx = products.findIndex(p => p.id === editingProductId);
        if (idx >= 0) products[idx] = { ...products[idx], name, price, category: cat, stock, icon };
    } else {
        products.push({ id: Date.now(), name, price, category: cat, stock, icon, image: '' });
    }
    saveProducts();
    hideProductForm();
    renderManagementGrid();
    renderProducts();
};

window.editProduct = function (id) {
    const p = products.find(x => x.id === id); if (!p) return;
    editingProductId = id;
    const sv = (elId, v) => { const el = $(elId); if (el) el.value = v; };
    sv('p-name', p.name); sv('p-price', p.price); sv('p-category', p.category); sv('p-stock', p.stock);
    const btn = $('save-product-btn'); if (btn) btn.textContent = 'Cập nhật';
    const fc = $('product-form-container');
    if (fc) { fc.style.display = 'block'; fc.scrollIntoView({ behavior: 'smooth' }); }
};

window.deleteProduct = function (id) {
    if (!confirm('Xác nhận xóa sản phẩm này?')) return;
    products = products.filter(p => p.id !== id);
    Object.values(tables).forEach(t => { t.cart = t.cart.filter(i => i.id !== id); });
    saveProducts(); saveTables();
    renderManagementGrid(); renderProducts(); renderCart();
};

function clearForm() {
    ['p-name', 'p-price'].forEach(id => { const el = $(id); if (el) el.value = ''; });
    const cat = $('p-category'); if (cat) cat.value = 'Trà';
    const stk = $('p-stock'); if (stk) stk.value = '100';
}

// ── Menu Display ──────────────────────────────────────────────
function renderMenu() {
    const container = $('menu-categories-list'); if (!container) return;
    const grouped = {};
    CATEGORIES.filter(c => c !== 'Tất cả').forEach(c => { grouped[c] = []; });
    products.forEach(p => { if (!grouped[p.category]) grouped[p.category] = []; grouped[p.category].push(p); });

    container.innerHTML = Object.entries(grouped)
        .filter(([, items]) => items.length > 0)
        .map(([cat, items], idx) => {
            const meta = CATEGORY_META[cat] || { color: 'orange', en: cat, icon: '📦' };
            const rows = items.map(item => {
                const priceStr = item.price > 0 ? fmt(item.price) : 'Miễn phí';
                return `<div class="menu-item-row">
                    <span class="menu-item-icon">${item.icon}</span>
                    <span class="menu-item-name" title="${item.name}">${item.name}</span>
                    <span class="menu-item-price ${item.price > 0 ? '' : 'free'}">${priceStr}</span>
                </div>`;
            }).join('');
            return `<div class="menu-category-block" style="animation-delay:${idx * 0.06}s">
                <div class="menu-category-header">
                    <span class="menu-category-icon">${meta.icon}</span>
                    <span class="menu-category-pill ${meta.color}">${cat}</span>
                </div>
                <div class="menu-items-grid">${rows}</div>
            </div>`;
        }).join('');
}

// ── Init ──────────────────────────────────────────────────────
renderTableBar();
renderCategoryTabs();
renderProducts();
renderCart();
updateStats();
