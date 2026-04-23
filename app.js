/* ============================================================
   Cà phê Gốc Đa — POS System
   app.js — Full rewrite for stability
============================================================ */

// ── Constants ──────────────────────────────────────────────
const STORAGE_KEY_PRODUCTS     = 'cafe_goc_da_products_v1';
const STORAGE_KEY_TRANSACTIONS = 'cafe_goc_da_transactions_v1';
const POS_PASSWORD             = 'man123';

const CATEGORY_META = {
    'Trà':           { color: 'green',  en: 'Tea',            icon: '🍵' },
    'Trà sữa':       { color: 'teal',   en: 'Milk Tea',       icon: '🧋' },
    'Nước ngọt':     { color: 'blue',   en: 'Soft Drinks',    icon: '🥤' },
    'Đồ có cồn':     { color: 'red',    en: 'Alcohol',        icon: '🍺' },
    'Thuốc lá':      { color: 'purple', en: 'Cigarettes',     icon: '🚬' },
    'Đồ ăn':         { color: 'orange', en: 'Snacks',         icon: '🐟' },
    'Hướng dương':   { color: 'yellow', en: 'Sunflower Seeds',icon: '🌻' },
    'Topping':       { color: 'pink',   en: 'Toppings',       icon: '🧊' }
};

const CATEGORIES = ['Tất cả', ...Object.keys(CATEGORY_META)];

// ── Default Products ────────────────────────────────────────
const DEFAULT_PRODUCTS = [
    { id: 1,  name: 'Trà đá',                     price: 5000,  category: 'Trà',        stock: 100 },
    { id: 2,  name: 'Trà quất',                   price: 10000, category: 'Trà',        stock: 100 },
    { id: 3,  name: 'Nhân trần',                  price: 5000,  category: 'Trà',        stock: 100 },
    { id: 4,  name: 'Trà Việt quất',              price: 0,     category: 'Trà',        stock: 100 },
    { id: 5,  name: 'Trà chanh leo hạt đá',       price: 0,     category: 'Trà',        stock: 100 },
    { id: 6,  name: 'Trà dâu tằm',               price: 0,     category: 'Trà',        stock: 100 },
    { id: 7,  name: 'Trà bí đao sương sáo',       price: 0,     category: 'Trà',        stock: 100 },
    { id: 8,  name: 'Trà sữa matcha',             price: 0,     category: 'Trà sữa',    stock: 100 },
    { id: 9,  name: 'Trà sữa Phúc Long',          price: 0,     category: 'Trà sữa',    stock: 100 },
    { id: 10, name: 'Trà sữa trân châu đường đen', price: 0,    category: 'Trà sữa',    stock: 100 },
    { id: 11, name: 'Sting đỏ',                   price: 15000, category: 'Nước ngọt',  stock: 100 },
    { id: 12, name: 'Sting vàng',                 price: 15000, category: 'Nước ngọt',  stock: 100 },
    { id: 13, name: 'Bò húc',                     price: 18000, category: 'Nước ngọt',  stock: 100 },
    { id: 14, name: 'C2 to',                      price: 15000, category: 'Nước ngọt',  stock: 100 },
    { id: 15, name: 'C2 nhỡ',                     price: 10000, category: 'Nước ngọt',  stock: 100 },
    { id: 16, name: 'Revive vàng',                price: 15000, category: 'Nước ngọt',  stock: 100 },
    { id: 17, name: 'Revive trắng',               price: 15000, category: 'Nước ngọt',  stock: 100 },
    { id: 18, name: 'Cam lon',                    price: 15000, category: 'Nước ngọt',  stock: 100 },
    { id: 19, name: 'Coca',                       price: 10000, category: 'Nước ngọt',  stock: 100 },
    { id: 20, name: 'Bon cha',                    price: 15000, category: 'Nước ngọt',  stock: 100 },
    { id: 21, name: 'Cà phê nâu',                 price: 25000, category: 'Nước ngọt',  stock: 100 },
    { id: 22, name: 'Nước mía',                   price: 0,     category: 'Nước ngọt',  stock: 100 },
    { id: 23, name: 'Nước dừa',                   price: 0,     category: 'Nước ngọt',  stock: 100 },
    { id: 24, name: 'Bia 333',                    price: 20000, category: 'Đồ có cồn',  stock: 100 },
    { id: 25, name: 'Bia Sài Gòn',                price: 20000, category: 'Đồ có cồn',  stock: 100 },
    { id: 26, name: 'Thăng long cứng',            price: 20000, category: 'Thuốc lá',   stock: 100 },
    { id: 27, name: 'Thăng long mềm',             price: 18000, category: 'Thuốc lá',   stock: 100 },
    { id: 28, name: 'Thuốc Vina',                 price: 25000, category: 'Thuốc lá',   stock: 100 },
    { id: 29, name: 'Cá bóng',                    price: 15000, category: 'Đồ ăn',      stock: 100 },
    { id: 30, name: 'Cá chỉ vàng',               price: 5000,  category: 'Đồ ăn',      stock: 100 },
    { id: 31, name: 'Hướng dương truyền thống',   price: 10000, category: 'Hướng dương', stock: 100 },
    { id: 32, name: 'Hướng dương vị dừa',         price: 12000, category: 'Hướng dương', stock: 100 },
    { id: 33, name: 'Nha đam',                    price: 0,     category: 'Topping',     stock: 100 },
    { id: 34, name: 'Trân châu trắng',            price: 0,     category: 'Topping',     stock: 100 }
].map(p => ({
    ...p,
    icon: (CATEGORY_META[p.category] || {}).icon || '📦',
    image: ''
}));

// ── State ───────────────────────────────────────────────────
function loadProducts() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.map(p => ({
                ...p,
                stock: p.stock !== undefined ? p.stock : 100,
                icon:  p.icon  || (CATEGORY_META[p.category] || {}).icon || '📦',
                image: p.image || ''
            }));
        }
    } catch(e) { console.warn('Failed to load products', e); }
    return DEFAULT_PRODUCTS;
}

function saveProducts() {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
}

function loadTransactions() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
        if (saved) return JSON.parse(saved);
    } catch(e) { console.warn('Failed to load transactions', e); }
    return [];
}

function saveTransactions() {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
}

let products     = loadProducts();
let transactions = loadTransactions();
let cart         = [];
let editingProductId = null;
let currentCategory  = 'Tất cả';

// ── DOM helpers ─────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Navigation ──────────────────────────────────────────────
window.switchTab = function(tabId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navEl = $('nav-' + tabId);
    if (navEl) navEl.classList.add('active');

    document.querySelectorAll('.tab-view').forEach(el => el.classList.remove('active'));
    const viewEl = $('view-' + tabId);
    if (viewEl) viewEl.classList.add('active');

    if (tabId === 'history')  renderHistory();
    if (tabId === 'products') renderManagementGrid();
    if (tabId === 'menu')     renderMenu();
    if (tabId === 'pos')      { renderCategoryTabs(); renderProducts(); }
};

// ── Category Tabs (POS) ─────────────────────────────────────
function renderCategoryTabs() {
    const container = $('category-tabs');
    if (!container) return;
    container.innerHTML = CATEGORIES.map(cat =>
        `<div class="cat-tab ${cat === currentCategory ? 'active' : ''}"
              onclick="setCategory('${cat.replace(/'/g, "\\'")}')">${cat}</div>`
    ).join('');
}

window.setCategory = function(cat) {
    currentCategory = cat;
    renderCategoryTabs();
    renderProducts();
};

// ── Product Grid (POS) ──────────────────────────────────────
function renderProducts() {
    const grid = $('product-grid');
    if (!grid) return;
    const list = currentCategory === 'Tất cả'
        ? products
        : products.filter(p => p.category === currentCategory);

    if (list.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted);padding:24px;">Không có sản phẩm.</p>';
        return;
    }

    grid.innerHTML = list.map(p => {
        const imgHtml = p.image
            ? `<img src="${p.image}" alt="${p.name}" class="product-image">`
            : `<div class="product-image-placeholder">${p.icon}</div>`;
        const soldOut = p.stock <= 0;
        return `<div class="product-card" onclick="addToCart(${p.id})"
                     style="${soldOut ? 'opacity:0.4;pointer-events:none;' : ''}">
            ${imgHtml}
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
                    <div class="product-price">${fmt(p.price)}</div>
                    <div style="font-size:11px;font-weight:700;color:${p.stock <= 5 ? '#ef4444' : 'var(--text-muted)'};">
                        SL: ${p.stock}
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');

    updateStats();
}

// ── Cart ─────────────────────────────────────────────────────
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(i => i.id === productId);
    const qty = existing ? existing.quantity : 0;
    if (qty >= product.stock) {
        alert(`${product.name} chỉ còn ${product.stock} trong kho!`);
        return;
    }
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    renderCart();
};

window.updateQuantity = function(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const product = products.find(p => p.id === id);
    if (delta > 0 && item.quantity >= product.stock) {
        alert(`Không thể thêm quá tồn kho (${product.stock}).`);
        return;
    }
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
    renderCart();
};

function renderCart() {
    const container   = $('cart-items-container');
    const emptyMsg    = $('empty-cart-msg');
    const totalEl     = $('cart-total');
    const checkoutBtn = $('checkout-btn');
    if (!container) return;

    if (cart.length === 0) {
        if (emptyMsg)    emptyMsg.style.display = 'block';
        container.innerHTML = '';
        if (totalEl)     totalEl.textContent = '0 đ';
        if (checkoutBtn) { checkoutBtn.disabled = true; checkoutBtn.style.opacity = '0.5'; }
        return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${fmt(item.price)}</div>
                <div class="quantity-control">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div style="font-weight:700;white-space:nowrap;">${fmt(item.price * item.quantity)}</div>
        </div>`).join('');

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    if (totalEl)     totalEl.textContent = fmt(total);
    if (checkoutBtn) { checkoutBtn.disabled = false; checkoutBtn.style.opacity = '1'; }
}

// ── Checkout ─────────────────────────────────────────────────
const checkoutBtnEl = $('checkout-btn');
if (checkoutBtnEl) {
    checkoutBtnEl.addEventListener('click', () => {
        if (cart.length === 0) return;
        $('checkout-modal').classList.add('active');
    });
}

window.closeCheckoutModal = function() {
    $('checkout-modal').classList.remove('active');
};

window.confirmCheckout = function() {
    $('checkout-modal').classList.remove('active');
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    cart.forEach(item => {
        const p = products.find(x => x.id === item.id);
        if (p) p.stock = Math.max(0, p.stock - item.quantity);
    });

    transactions.push({
        id:        Date.now(),
        timestamp: new Date().toLocaleString('vi-VN'),
        items:     cart.map(i => ({ ...i })),
        total
    });

    saveProducts();
    saveTransactions();

    const btn = $('checkout-btn');
    if (btn) btn.innerHTML = '<span>✓ Thành công!</span>';
    setTimeout(() => {
        cart = [];
        renderCart();
        renderProducts();
        if (btn) btn.innerHTML = '<span>Thanh toán</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    }, 1200);
};

const clearCartBtn = $('clear-cart');
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => { cart = []; renderCart(); });
}

// ── Stats ────────────────────────────────────────────────────
function updateStats() {
    const today = new Date().toLocaleDateString('vi-VN');
    const todays = transactions.filter(t => t.timestamp.startsWith(today) || t.timestamp.includes(today.replace(/\//g, '/')));
    const revenue = todays.reduce((s, t) => s + t.total, 0);
    const count   = todays.length;

    const ocEl = $('order-count');        if (ocEl) ocEl.textContent = count;
    const rvEl = $('history-revenue-val'); if (rvEl) rvEl.textContent = fmt(revenue);
    const hcEl = $('history-order-count'); if (hcEl) hcEl.textContent = count;
}

// ── History ──────────────────────────────────────────────────
function renderHistory() {
    const list = $('history-list');
    if (!list) return;
    updateStats();
    if (transactions.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:32px;color:var(--text-muted);">Chưa có giao dịch nào.</div>';
        return;
    }
    list.innerHTML = transactions.slice().reverse().map(t => `
        <div class="data-row">
            <span>${t.timestamp}</span>
            <span>${t.items ? t.items.length : 0} món</span>
            <span style="font-weight:700;">${fmt(t.total)}</span>
            <button class="btn btn-secondary" style="padding:6px 12px;font-size:12px;">Xem</button>
        </div>`).join('');
}

window.requestRevenuePassword = function() {
    const pwd = prompt('Nhập mật khẩu để xem doanh thu:');
    if (pwd === POS_PASSWORD) {
        const btn = $('revenue-unlock-btn');
        const val = $('history-revenue-val');
        if (btn) btn.style.display = 'none';
        if (val) { val.style.display = 'block'; updateStats(); }
    } else if (pwd !== null) {
        alert('Mật khẩu không đúng!');
    }
};

// ── Product Management ───────────────────────────────────────
function getIconForCategory(cat) {
    return (CATEGORY_META[cat] || {}).icon || '📦';
}

function renderManagementGrid() {
    const list = $('management-product-list');
    if (!list) return;
    if (products.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:32px;color:var(--text-muted);">Chưa có sản phẩm.</div>';
        return;
    }
    list.innerHTML = products.map(p => `
        <div class="data-row" style="grid-template-columns:1fr 1fr 1fr 80px 140px;">
            <span style="font-weight:600;">${p.icon} ${p.name}</span>
            <span>${p.category}</span>
            <span>${fmt(p.price)}</span>
            <span style="color:${p.stock <= 5 ? '#ef4444' : 'inherit'};font-weight:600;">${p.stock}</span>
            <div style="display:flex;gap:6px;">
                <button class="btn btn-secondary" style="padding:6px 12px;font-size:13px;"
                        onclick="editProduct(${p.id})">Sửa</button>
                <button class="btn btn-secondary" style="padding:6px 12px;font-size:13px;color:#ef4444;"
                        onclick="deleteProduct(${p.id})">Xóa</button>
            </div>
        </div>`).join('');
}

window.showAddProductForm = function() {
    editingProductId = null;
    clearForm();
    const btn = $('save-product-btn');
    if (btn) btn.textContent = 'Thêm sản phẩm';
    const fc = $('product-form-container');
    if (fc) { fc.style.display = 'block'; fc.scrollIntoView({ behavior: 'smooth' }); }
};

window.hideProductForm = function() {
    const fc = $('product-form-container');
    if (fc) fc.style.display = 'none';
    editingProductId = null;
};

window.saveProduct = function() {
    const name  = ($('p-name')     || {}).value?.trim();
    const price = parseFloat(($('p-price') || {}).value);
    const cat   = ($('p-category') || {}).value;
    const stock = parseInt(($('p-stock')   || {}).value) || 0;

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

window.editProduct = function(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    editingProductId = id;
    const setVal = (elId, v) => { const el = $(elId); if (el) el.value = v; };
    setVal('p-name',     p.name);
    setVal('p-price',    p.price);
    setVal('p-category', p.category);
    setVal('p-stock',    p.stock);
    const btn = $('save-product-btn');
    if (btn) btn.textContent = 'Cập nhật';
    const fc = $('product-form-container');
    if (fc) { fc.style.display = 'block'; fc.scrollIntoView({ behavior: 'smooth' }); }
};

window.deleteProduct = function(id) {
    if (!confirm('Xác nhận xóa sản phẩm này?')) return;
    products = products.filter(p => p.id !== id);
    cart = cart.filter(i => i.id !== id);
    saveProducts();
    renderManagementGrid();
    renderProducts();
    renderCart();
};

function clearForm() {
    ['p-name','p-price','p-stock'].forEach(id => { const el = $(id); if (el) el.value = ''; });
    const cat = $('p-category'); if (cat) cat.value = 'Trà';
    const stock = $('p-stock'); if (stock) stock.value = '100';
}

// ── Menu Display ─────────────────────────────────────────────
function renderMenu() {
    const container = $('menu-categories-list');
    if (!container) return;

    const grouped = {};
    CATEGORIES.filter(c => c !== 'Tất cả').forEach(c => { grouped[c] = []; });
    products.forEach(p => {
        if (!grouped[p.category]) grouped[p.category] = [];
        grouped[p.category].push(p);
    });

    container.innerHTML = Object.entries(grouped)
        .filter(([, items]) => items.length > 0)
        .map(([cat, items]) => {
            const meta = CATEGORY_META[cat] || { color: 'orange', en: cat, icon: '📦' };
            const rows = items.map(item => {
                const priceStr  = item.price > 0 ? fmt(item.price) : 'Liên hệ';
                const priceClass = item.price > 0 ? '' : 'free';
                return `<div class="menu-item-row">
                    <span class="menu-item-icon">${item.icon}</span>
                    <span class="menu-item-name">${item.name}</span>
                    <span class="menu-item-dots"></span>
                    <span class="menu-item-price ${priceClass}">${priceStr}</span>
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

// ── Utility ──────────────────────────────────────────────────
function fmt(amount) {
    return Number(amount || 0).toLocaleString('vi-VN') + ' đ';
}

// ── Init ─────────────────────────────────────────────────────
renderCategoryTabs();
renderProducts();
renderCart();
updateStats();
