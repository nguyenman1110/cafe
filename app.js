/* ============================================================
   Cà phê Gốc Đa — POS System — app.js
   Full rewrite with Table Management
============================================================ */

// ── Constants ──────────────────────────────────────────────
const STORAGE_PRODUCTS     = 'cafe_products_v2';
const STORAGE_TRANSACTIONS = 'cafe_transactions_v2';
const STORAGE_TABLES       = 'cafe_tables_v2';
const POS_PASSWORD         = 'man123';
const DEFAULT_TABLE_COUNT  = 8;

const CATEGORY_META = {
    'Trà':           { color: 'green',  en: 'Tea',             icon: '🍵' },
    'Trà sữa':       { color: 'teal',   en: 'Milk Tea',        icon: '🧋' },
    'Nước ngọt':     { color: 'blue',   en: 'Soft Drinks',     icon: '🥤' },
    'Đồ có cồn':     { color: 'red',    en: 'Alcohol',         icon: '🍺' },
    'Thuốc lá':      { color: 'purple', en: 'Cigarettes',      icon: '🚬' },
    'Đồ ăn':         { color: 'orange', en: 'Snacks',          icon: '🐟' },
    'Hướng dương':   { color: 'yellow', en: 'Sunflower Seeds', icon: '🌻' },
    'Topping':       { color: 'pink',   en: 'Toppings',        icon: '🧊' }
};
const CATEGORIES = ['Tất cả', ...Object.keys(CATEGORY_META)];

// ── Default Products ────────────────────────────────────────
const DEFAULT_PRODUCTS = [
    { id: 1,  name: 'Trà đá',                      price: 5000,  category: 'Trà',         stock: 100 },
    { id: 2,  name: 'Trà quất',                    price: 10000, category: 'Trà',         stock: 100 },
    { id: 3,  name: 'Nhân trần',                   price: 5000,  category: 'Trà',         stock: 100 },
    { id: 4,  name: 'Trà Việt quất',               price: 0,     category: 'Trà',         stock: 100 },
    { id: 5,  name: 'Trà chanh leo hạt đá',        price: 0,     category: 'Trà',         stock: 100 },
    { id: 6,  name: 'Trà dâu tằm',                price: 0,     category: 'Trà',         stock: 100 },
    { id: 7,  name: 'Trà bí đao sương sáo',        price: 0,     category: 'Trà',         stock: 100 },
    { id: 8,  name: 'Trà sữa matcha',              price: 0,     category: 'Trà sữa',     stock: 100 },
    { id: 9,  name: 'Trà sữa Phúc Long',           price: 0,     category: 'Trà sữa',     stock: 100 },
    { id: 10, name: 'Trà sữa trân châu đường đen', price: 0,     category: 'Trà sữa',     stock: 100 },
    { id: 11, name: 'Sting đỏ',                    price: 15000, category: 'Nước ngọt',   stock: 100 },
    { id: 12, name: 'Sting vàng',                  price: 15000, category: 'Nước ngọt',   stock: 100 },
    { id: 13, name: 'Bò húc',                      price: 18000, category: 'Nước ngọt',   stock: 100 },
    { id: 14, name: 'C2 to',                       price: 15000, category: 'Nước ngọt',   stock: 100 },
    { id: 15, name: 'C2 nhỡ',                      price: 10000, category: 'Nước ngọt',   stock: 100 },
    { id: 16, name: 'Revive vàng',                 price: 15000, category: 'Nước ngọt',   stock: 100 },
    { id: 17, name: 'Revive trắng',                price: 15000, category: 'Nước ngọt',   stock: 100 },
    { id: 18, name: 'Cam lon',                     price: 15000, category: 'Nước ngọt',   stock: 100 },
    { id: 19, name: 'Coca',                        price: 10000, category: 'Nước ngọt',   stock: 100 },
    { id: 20, name: 'Bon cha',                     price: 15000, category: 'Nước ngọt',   stock: 100 },
    { id: 21, name: 'Cà phê nâu',                  price: 25000, category: 'Nước ngọt',   stock: 100 },
    { id: 22, name: 'Nước mía',                    price: 0,     category: 'Nước ngọt',   stock: 100 },
    { id: 23, name: 'Nước dừa',                    price: 0,     category: 'Nước ngọt',   stock: 100 },
    { id: 24, name: 'Bia 333',                     price: 20000, category: 'Đồ có cồn',   stock: 100 },
    { id: 25, name: 'Bia Sài Gòn',                 price: 20000, category: 'Đồ có cồn',   stock: 100 },
    { id: 26, name: 'Thăng long cứng',             price: 20000, category: 'Thuốc lá',    stock: 100 },
    { id: 27, name: 'Thăng long mềm',              price: 18000, category: 'Thuốc lá',    stock: 100 },
    { id: 28, name: 'Thuốc Vina',                  price: 25000, category: 'Thuốc lá',    stock: 100 },
    { id: 29, name: 'Cá bóng',                     price: 15000, category: 'Đồ ăn',       stock: 100 },
    { id: 30, name: 'Cá chỉ vàng',                price: 5000,  category: 'Đồ ăn',       stock: 100 },
    { id: 31, name: 'Hướng dương truyền thống',    price: 10000, category: 'Hướng dương',  stock: 100 },
    { id: 32, name: 'Hướng dương vị dừa',          price: 12000, category: 'Hướng dương',  stock: 100 },
    { id: 33, name: 'Nha đam',                     price: 0,     category: 'Topping',      stock: 100 },
    { id: 34, name: 'Trân châu trắng',             price: 0,     category: 'Topping',      stock: 100 }
].map(p => ({ ...p, icon: (CATEGORY_META[p.category] || {}).icon || '📦', image: '' }));

// ── Helpers ─────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const fmt = n => Number(n || 0).toLocaleString('vi-VN') + ' đ';

// ── Storage ──────────────────────────────────────────────────
function loadProducts() {
    try {
        const s = localStorage.getItem(STORAGE_PRODUCTS);
        if (s) return JSON.parse(s).map(p => ({
            ...p,
            stock: p.stock ?? 100,
            icon:  p.icon  || (CATEGORY_META[p.category] || {}).icon || '📦',
            image: p.image || ''
        }));
    } catch(e) {}
    return DEFAULT_PRODUCTS.map(p => ({ ...p }));
}
function saveProducts()     { localStorage.setItem(STORAGE_PRODUCTS,     JSON.stringify(products)); }

function loadTransactions() {
    try { const s = localStorage.getItem(STORAGE_TRANSACTIONS); if (s) return JSON.parse(s); } catch(e) {}
    return [];
}
function saveTransactions() { localStorage.setItem(STORAGE_TRANSACTIONS, JSON.stringify(transactions)); }

function loadTables() {
    try {
        const s = localStorage.getItem(STORAGE_TABLES);
        if (s) {
            const data = JSON.parse(s);
            // Migrate: ensure each table has a cart array
            Object.values(data).forEach(t => { if (!Array.isArray(t.cart)) t.cart = []; });
            return data;
        }
    } catch(e) {}
    // Create default tables
    const t = {};
    for (let i = 1; i <= DEFAULT_TABLE_COUNT; i++) {
        t[i] = { id: i, name: `Bàn ${i}`, cart: [] };
    }
    return t;
}
function saveTables() { localStorage.setItem(STORAGE_TABLES, JSON.stringify(tables)); }

// ── State ────────────────────────────────────────────────────
let products        = loadProducts();
let transactions    = loadTransactions();
let tables          = loadTables();
let currentTableId  = Object.keys(tables)[0] ? Number(Object.keys(tables)[0]) : 1;
let currentCategory = 'Tất cả';
let editingProductId = null;

function currentCart() { return tables[currentTableId]?.cart || []; }

// ── Navigation ───────────────────────────────────────────────
window.switchTab = function(tabId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const nav = $('nav-' + tabId); if (nav) nav.classList.add('active');
    document.querySelectorAll('.tab-view').forEach(el => el.classList.remove('active'));
    const view = $('view-' + tabId); if (view) view.classList.add('active');
    if (tabId === 'history')  renderHistory();
    if (tabId === 'products') renderManagementGrid();
    if (tabId === 'menu')     renderMenu();
    if (tabId === 'pos')      { renderTableBar(); renderCategoryTabs(); renderProducts(); renderCart(); }
};

// ── Table Management ─────────────────────────────────────────
function renderTableBar() {
    const bar = $('table-bar');
    if (!bar) return;

    const tableButtons = Object.values(tables).map(t => {
        const itemCount = t.cart.reduce((s, i) => s + i.quantity, 0);
        const hasItems  = t.cart.length > 0;
        const isCurrent = t.id === currentTableId;
        const classes   = ['table-btn', isCurrent ? 'current' : '', hasItems ? 'has-items' : ''].filter(Boolean).join(' ');
        const badge     = hasItems ? `<span class="table-badge">${itemCount}</span>` : '';
        return `<button class="${classes}" onclick="selectTable(${t.id})" title="${t.name}">
            ${badge}
            <span class="table-icon">🪑</span>
            <span class="table-label">${t.name}</span>
        </button>`;
    }).join('');

    bar.innerHTML = tableButtons + `<button class="add-table-btn" onclick="addTable()" title="Thêm bàn">＋</button>`;

    // Update cart panel header
    const nameEl = $('cart-table-name');
    if (nameEl) nameEl.textContent = tables[currentTableId]?.name || 'Bàn';

    // Update active tables badge
    const activeCount = $('active-tables-count');
    if (activeCount) activeCount.textContent = Object.values(tables).filter(t => t.cart.length > 0).length;
}

window.selectTable = function(id) {
    saveTables(); // Save current table state
    currentTableId = id;
    renderTableBar();
    renderCart();
};

window.addTable = function() {
    const ids = Object.keys(tables).map(Number);
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    tables[newId] = { id: newId, name: `Bàn ${newId}`, cart: [] };
    saveTables();
    currentTableId = newId;
    renderTableBar();
    renderCart();
};

window.showActiveOrders = function() {
    const active = Object.values(tables).filter(t => t.cart.length > 0);
    if (active.length === 0) { alert('Hiện không có bàn nào đang có đơn.'); return; }
    const list = active.map(t => {
        const total = t.cart.reduce((s, i) => s + i.price * i.quantity, 0);
        const items = t.cart.reduce((s, i) => s + i.quantity, 0);
        return `${t.name}: ${items} món — ${fmt(total)}`;
    }).join('\n');
    alert(`Bàn đang có đơn:\n\n${list}`);
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

window.setCategory = function(cat) {
    currentCategory = cat;
    renderCategoryTabs();
    renderProducts();
};

// ── Product Grid ──────────────────────────────────────────────
function renderProducts() {
    const grid = $('product-grid'); if (!grid) return;
    const list = currentCategory === 'Tất cả'
        ? products
        : products.filter(p => p.category === currentCategory);

    if (list.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted);padding:24px;grid-column:1/-1;">Không có sản phẩm.</p>';
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
window.addToCart = function(productId) {
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

window.updateQuantity = function(id, delta) {
    const table = tables[currentTableId]; if (!table) return;
    const item  = table.cart.find(i => i.id === id); if (!item) return;
    const prod  = products.find(p => p.id === id);
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
    const emptyMsg  = $('empty-cart-msg');
    const totalEl   = $('cart-total');
    const btn       = $('checkout-btn');
    const nameEl    = $('cart-table-name');
    if (!container) return;

    const cart = currentCart();
    if (nameEl) nameEl.textContent = tables[currentTableId]?.name || 'Bàn';

    if (cart.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
        // Clear injected cart items but keep empty msg
        Array.from(container.children).forEach(c => {
            if (c.id !== 'empty-cart-msg') c.remove();
        });
        if (totalEl) totalEl.textContent = '0 đ';
        if (btn) { btn.disabled = true; btn.style.opacity = '.5'; }
        return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';
    // Remove old cart items
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

// ── Checkout ──────────────────────────────────────────────────
const checkoutBtnEl = $('checkout-btn');
if (checkoutBtnEl) {
    checkoutBtnEl.addEventListener('click', () => {
        const cart = currentCart();
        if (cart.length === 0) return;
        const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
        const tableName = tables[currentTableId]?.name || 'Bàn';
        const titleEl = $('checkout-modal-title');
        const totalEl = $('checkout-modal-total');
        if (titleEl) titleEl.textContent = `Thanh toán ${tableName}`;
        if (totalEl) totalEl.textContent = `Tổng: ${fmt(total)}`;
        $('checkout-modal').classList.add('active');
    });
}

window.closeCheckoutModal = function() {
    $('checkout-modal').classList.remove('active');
};

// "Bảo lưu" — just close and let user switch table
window.saveAndSwitch = function() {
    $('checkout-modal').classList.remove('active');
    // Show the table bar to make it easy to switch
    alert(`Đã bảo lưu đơn cho ${tables[currentTableId]?.name}.\nNhấn vào bàn khác trên thanh bàn để chuyển đơn.`);
};

window.confirmCheckout = function() {
    $('checkout-modal').classList.remove('active');
    const table = tables[currentTableId];
    if (!table) return;
    const cart  = [...table.cart];
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    // Deduct stock
    cart.forEach(item => {
        const p = products.find(x => x.id === item.id);
        if (p) p.stock = Math.max(0, p.stock - item.quantity);
    });

    // Record transaction
    transactions.push({
        id:        Date.now(),
        timestamp: new Date().toLocaleString('vi-VN'),
        table:     table.name,
        items:     cart,
        total
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
    const today  = new Date().toLocaleDateString('vi-VN');
    const todays = transactions.filter(t => t.timestamp && t.timestamp.includes(today));
    const revenue = todays.reduce((s, t) => s + t.total, 0);
    const count   = todays.length;

    const oc = $('order-count');        if (oc) oc.textContent = count;
    const hc = $('history-order-count');if (hc) hc.textContent = count;
    const rv = $('history-revenue-val');if (rv) rv.textContent = fmt(revenue);
    const at = $('active-tables-count');
    if (at) at.textContent = Object.values(tables).filter(t => t.cart.length > 0).length;
}

// ── History ───────────────────────────────────────────────────
function renderHistory() {
    const list = $('history-list'); if (!list) return;
    updateStats();
    if (transactions.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:32px;color:var(--text-muted);">Chưa có giao dịch.</div>';
        return;
    }
    list.innerHTML = transactions.slice().reverse().map(t => `
        <div class="data-row">
            <span style="font-size:13px;">${t.timestamp}</span>
            <span style="font-weight:700;">${t.table || '—'}</span>
            <span>${(t.items || []).length} món</span>
            <span style="font-weight:800;color:var(--primary);">${fmt(t.total)}</span>
        </div>`).join('');
}

window.requestRevenuePassword = function() {
    const pwd = prompt('Nhập mật khẩu để xem doanh thu:');
    if (pwd === POS_PASSWORD) {
        const btn = $('revenue-unlock-btn'); if (btn) btn.style.display = 'none';
        const val = $('history-revenue-val'); if (val) { val.style.display = 'block'; updateStats(); }
    } else if (pwd !== null) {
        alert('Mật khẩu không đúng!');
    }
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

window.showAddProductForm = function() {
    editingProductId = null;
    clearForm();
    const btn = $('save-product-btn'); if (btn) btn.textContent = 'Thêm sản phẩm';
    const fc  = $('product-form-container');
    if (fc) { fc.style.display = 'block'; fc.scrollIntoView({ behavior: 'smooth' }); }
};

window.hideProductForm = function() {
    const fc = $('product-form-container'); if (fc) fc.style.display = 'none';
    editingProductId = null;
};

window.saveProduct = function() {
    const name  = ($('p-name') || {}).value?.trim();
    const price = parseFloat(($('p-price') || {}).value);
    const cat   = ($('p-category') || {}).value;
    const stock = parseInt(($('p-stock') || {}).value) || 0;

    if (!name)     { alert('Vui lòng nhập tên sản phẩm.'); return; }
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

window.editProduct = function(id) {
    const p = products.find(x => x.id === id); if (!p) return;
    editingProductId = id;
    const sv = (elId, v) => { const el = $(elId); if (el) el.value = v; };
    sv('p-name', p.name); sv('p-price', p.price); sv('p-category', p.category); sv('p-stock', p.stock);
    const btn = $('save-product-btn'); if (btn) btn.textContent = 'Cập nhật';
    const fc  = $('product-form-container');
    if (fc) { fc.style.display = 'block'; fc.scrollIntoView({ behavior: 'smooth' }); }
};

window.deleteProduct = function(id) {
    if (!confirm('Xác nhận xóa sản phẩm này?')) return;
    products = products.filter(p => p.id !== id);
    // Remove from all table carts too
    Object.values(tables).forEach(t => { t.cart = t.cart.filter(i => i.id !== id); });
    saveProducts(); saveTables();
    renderManagementGrid(); renderProducts(); renderCart();
};

function clearForm() {
    ['p-name','p-price'].forEach(id => { const el = $(id); if (el) el.value = ''; });
    const cat = $('p-category'); if (cat) cat.value = 'Trà';
    const stk = $('p-stock');   if (stk) stk.value = '100';
}

// ── Menu Display ──────────────────────────────────────────────
function renderMenu() {
    const container = $('menu-categories-list'); if (!container) return;
    const grouped = {};
    CATEGORIES.filter(c => c !== 'Tất cả').forEach(c => { grouped[c] = []; });
    products.forEach(p => { if (!grouped[p.category]) grouped[p.category] = []; grouped[p.category].push(p); });

    container.innerHTML = Object.entries(grouped)
        .filter(([, items]) => items.length > 0)
        .map(([cat, items]) => {
            const meta = CATEGORY_META[cat] || { color: 'orange', en: cat, icon: '📦' };
            const rows = items.map(item => {
                const priceStr = item.price > 0 ? fmt(item.price) : 'Liên hệ';
                return `<div class="menu-item-row">
                    <span class="menu-item-icon">${item.icon}</span>
                    <span class="menu-item-name">${item.name}</span>
                    <span class="menu-item-dots"></span>
                    <span class="menu-item-price ${item.price > 0 ? '' : 'free'}">${priceStr}</span>
                </div>`;
            }).join('');
            return `<div class="menu-category-block">
                <div class="menu-category-header">
                    <span class="menu-category-icon">${meta.icon}</span>
                    <span class="menu-category-pill ${meta.color}">${cat} / ${meta.en}</span>
                </div>
                ${rows}
            </div>`;
        }).join('');
}

// ── Init ──────────────────────────────────────────────────────
renderTableBar();
renderCategoryTabs();
renderProducts();
renderCart();
updateStats();
