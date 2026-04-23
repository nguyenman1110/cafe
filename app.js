// Data Persistence Initialization
let products = JSON.parse(localStorage.getItem('pos_products_v2')) || [
    { id: 1, name: 'Trà đá', price: 5000, category: 'Trà', image: '' },
    { id: 2, name: 'Trà quất', price: 10000, category: 'Trà', image: '' },
    { id: 3, name: 'Nhân trần', price: 5000, category: 'Trà', image: '' },
    { id: 4, name: 'Trà Việt quất', price: 0, category: 'Trà', image: '' },
    { id: 5, name: 'Trà chanh leo hạt đá', price: 0, category: 'Trà', image: '' },
    { id: 6, name: 'Trà dâu tằm', price: 0, category: 'Trà', image: '' },
    { id: 7, name: 'Trà bí đao sương sáo', price: 0, category: 'Trà', image: '' },
    
    { id: 8, name: 'Trà sữa matcha', price: 0, category: 'Trà sữa', image: '' },
    { id: 9, name: 'Trà sữa Phúc Long', price: 0, category: 'Trà sữa', image: '' },
    { id: 10, name: 'Trà sữa trân châu đường đen', price: 0, category: 'Trà sữa', image: '' },

    { id: 11, name: 'Sting đỏ', price: 15000, category: 'Nước ngọt', image: '' },
    { id: 12, name: 'Sting vàng', price: 15000, category: 'Nước ngọt', image: '' },
    { id: 13, name: 'Bò húc', price: 18000, category: 'Nước ngọt', image: '' },
    { id: 14, name: 'C2 to', price: 15000, category: 'Nước ngọt', image: '' },
    { id: 15, name: 'C2 nhỡ', price: 10000, category: 'Nước ngọt', image: '' },
    { id: 16, name: 'Revive vàng', price: 15000, category: 'Nước ngọt', image: '' },
    { id: 17, name: 'Revive trắng', price: 15000, category: 'Nước ngọt', image: '' },
    { id: 18, name: 'Cam lon', price: 15000, category: 'Nước ngọt', image: '' },
    { id: 19, name: 'Coca', price: 10000, category: 'Nước ngọt', image: '' },
    { id: 20, name: 'Bon cha', price: 15000, category: 'Nước ngọt', image: '' },
    { id: 21, name: 'Cà phê nâu', price: 25000, category: 'Nước ngọt', image: '' },
    { id: 22, name: 'Nước mía', price: 0, category: 'Nước ngọt', image: '' },
    { id: 23, name: 'Nước dừa', price: 0, category: 'Nước ngọt', image: '' },

    { id: 24, name: 'Bia 333', price: 20000, category: 'Đồ có cồn', image: '' },
    { id: 25, name: 'Bia Sài Gòn', price: 20000, category: 'Đồ có cồn', image: '' },

    { id: 26, name: 'Thăng long cứng', price: 20000, category: 'Thuốc lá', image: '' },
    { id: 27, name: 'Thăng long mềm', price: 18000, category: 'Thuốc lá', image: '' },
    { id: 28, name: 'Thuốc Vina', price: 25000, category: 'Thuốc lá', image: '' },

    { id: 29, name: 'Cá bóng', price: 15000, category: 'Đồ ăn', image: '' },
    { id: 30, name: 'Cá chỉ vàng', price: 5000, category: 'Đồ ăn', image: '' },

    { id: 31, name: 'Hướng dương truyền thống', price: 10000, category: 'Hướng dương', image: '' },
    { id: 32, name: 'Hướng dương vị dừa', price: 12000, category: 'Hướng dương', image: '' },

    { id: 33, name: 'Nha đam', price: 0, category: 'Topping', image: '' },
    { id: 34, name: 'Trân châu trắng', price: 0, category: 'Topping', image: '' }
];

let transactions = JSON.parse(localStorage.getItem('pos_transactions_v2')) || [];
let cart = [];
let editingProductId = null;

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalElement = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const emptyMsg = document.getElementById('empty-cart-msg');
const revenueVal = document.getElementById('revenue-val');
const orderCountVal = document.getElementById('order-count');

// Navigation / Tab Switching
window.switchTab = (tabId) => {
    // Update Sidebar UI
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById(`nav-${tabId}`).classList.add('active');

    // Update View UI
    document.querySelectorAll('.tab-view').forEach(view => view.classList.remove('active'));
    document.getElementById(`view-${tabId}`).classList.add('active');

    if (tabId === 'history') renderHistory();
    if (tabId === 'products') renderManagementGrid();
    if (tabId === 'pos') renderProducts();
};

// --- POS Logic ---
function renderProducts() {
    productGrid.innerHTML = products.map(product => {
        const imgHtml = product.image 
            ? `<img src="${product.image}" alt="${product.name}" class="product-image">`
            : `<div class="product-image-placeholder">${product.name.charAt(0)}</div>`;
            
        return `
        <div class="product-card" onclick="addToCart(${product.id})">
            ${imgHtml}
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${parseFloat(product.price).toLocaleString('vi-VN')} đ</div>
            </div>
        </div>
    `}).join('');
    updateStats();
}

window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    renderCart();
};

function renderCart() {
    if (cart.length === 0) {
        emptyMsg.style.display = 'block';
        cartItemsContainer.innerHTML = '';
        updateCartTotal(0);
        return;
    }

    emptyMsg.style.display = 'none';
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${parseFloat(item.price).toLocaleString('vi-VN')} đ</div>
                <div class="quantity-control">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div style="font-weight: 700;">${(item.price * item.quantity).toLocaleString('vi-VN')} đ</div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateCartTotal(total);
}

function updateQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
    renderCart();
}

function updateCartTotal(total) {
    cartTotalElement.textContent = `${total.toLocaleString('vi-VN')} đ`;
    checkoutBtn.disabled = cart.length === 0;
    checkoutBtn.style.opacity = cart.length === 0 ? '0.5' : '1';
}

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    document.getElementById('checkout-modal').classList.add('active');
});

window.closeCheckoutModal = () => {
    document.getElementById('checkout-modal').classList.remove('active');
};

window.confirmCheckout = () => {
    document.getElementById('checkout-modal').classList.remove('active');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Save transaction
    transactions.push({
        id: Date.now(),
        timestamp: new Date().toLocaleString('vi-VN'),
        items: [...cart],
        total: total
    });
    localStorage.setItem('pos_transactions_v2', JSON.stringify(transactions));

    // Feedback
    checkoutBtn.innerHTML = '<span>Thành công!</span>';
    setTimeout(() => {
        cart = [];
        renderCart();
        updateStats();
        checkoutBtn.innerHTML = '<span>Thanh toán</span>';
    }, 1000);
};

function updateStats() {
    const today = new Date().toLocaleDateString('vi-VN');
    const todaysOrders = transactions.filter(t => t.timestamp.includes(today));
    const revenue = todaysOrders.reduce((s, o) => s + o.total, 0);

    revenueVal.textContent = `${revenue.toLocaleString('vi-VN')} đ`;
    orderCountVal.textContent = todaysOrders.length;
}

// --- History Logic ---
function renderHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = transactions.slice().reverse().map(t => `
        <div class="data-row">
            <span>${t.timestamp}</span>
            <span>${t.items.length} món</span>
            <span style="font-weight: 700;">${t.total.toLocaleString('vi-VN')} đ</span>
            <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;">Xem</button>
        </div>
    `).join('');
}

// --- Product Management Logic ---
function renderManagementGrid() {
    const list = document.getElementById('management-product-list');
    list.innerHTML = products.map((p, i) => `
        <div class="data-row">
            <span style="font-weight: 600;">${p.name}</span>
            <span>${p.category}</span>
            <span>${parseFloat(p.price).toLocaleString('vi-VN')} đ</span>
            <div style="display: flex; gap: 8px;">
                <button class="btn btn-secondary" style="padding: 6px 12px;" onclick="editProduct(${p.id})">Sửa</button>
                <button class="btn btn-secondary" style="padding: 6px 12px; color: #ef4444;" onclick="deleteProduct(${p.id})">Xóa</button>
            </div>
        </div>
    `).join('');
}

window.showAddProductForm = () => {
    editingProductId = null;
    document.getElementById('product-form-container').style.display = 'block';
    document.getElementById('save-product-btn').textContent = 'Lưu sản phẩm';
    clearForm();
};

window.hideProductForm = () => {
    document.getElementById('product-form-container').style.display = 'none';
};

window.saveProduct = () => {
    const name = document.getElementById('p-name').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const category = document.getElementById('p-category').value;
    const image = document.getElementById('p-image').value || '';

    if (!name || isNaN(price)) {
        alert("Vui lòng nhập tên và giá.");
        return;
    }

    if (editingProductId) {
        const idx = products.findIndex(p => p.id === editingProductId);
        products[idx] = { ...products[idx], name, price, category, image };
    } else {
        products.push({ id: Date.now(), name, price, category, image });
    }

    localStorage.setItem('pos_products_v2', JSON.stringify(products));
    hideProductForm();
    renderManagementGrid();
    renderProducts(); // Keep POS grid in sync
};

window.editProduct = (id) => {
    const p = products.find(p => p.id === id);
    editingProductId = id;
    document.getElementById('p-name').value = p.name;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-category').value = p.category;
    document.getElementById('p-image').value = p.image;

    document.getElementById('product-form-container').style.display = 'block';
    document.getElementById('save-product-btn').textContent = 'Cập nhật';
};

window.deleteProduct = (id) => {
    if (confirm("Chắc chắn xóa?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('pos_products_v2', JSON.stringify(products));
        renderManagementGrid();
        renderProducts();
    }
};

function clearForm() {
    document.getElementById('p-name').value = '';
    document.getElementById('p-price').value = '';
    document.getElementById('p-category').value = 'Trà';
    document.getElementById('p-image').value = '';
}

// Global actions exposed to HTML
window.updateQuantity = updateQuantity;

const clearCartBtn = document.getElementById('clear-cart');
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        renderCart();
    });
}

// Init
renderProducts();
updateStats();
