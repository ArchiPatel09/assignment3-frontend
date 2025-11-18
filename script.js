const API_BASE = 'https://backend-assignment3-1.onrender.com/api';

let cartItems = [];

// page navigation
function viewCart() {
    document.getElementById('productsPage').classList.remove('active');
    document.getElementById('cartPage').classList.add('active');
    loadCart();
}

function viewProducts() {
    document.getElementById('cartPage').classList.remove('active');
    document.getElementById('productsPage').classList.add('active');
}

// loading products from backend
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// displaying products in grid
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <p><strong>SKU:</strong> ${product.sku}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">
                Add to Cart
            </button>
        `;
        grid.appendChild(productCard);
    });
}

// add to cart button logic implementation
async function addToCart(productId, productName, price, image) {
    try {
        const response = await fetch(`${API_BASE}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: productId,
                productName: productName,
                price: price,
                quantity: 1,
                image: image
            })
        });

        if (response.ok) {
            updateCartCount();
            alert('Product added to cart!');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

// loading cart
async function loadCart() {
    try {
        const response = await fetch(`${API_BASE}/cart`);
        cartItems = await response.json();
        displayCartItems();
        updateCartCount();
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// displaying cart items 
function displayCartItems() {
    const cartContainer = document.getElementById('cartItems');
    const totalAmount = document.getElementById('totalAmount');
    
    cartContainer.innerHTML = '';
    let total = 0;

    cartItems.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <img src="${item.image}" alt="${item.productName}" onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
                <div>
                    <h4>${item.productName}</h4>
                    <p>$${item.price} x ${item.quantity}</p>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
    });

    totalAmount.textContent = total.toFixed(2);
}

// remove from the cart button logic
async function removeFromCart(cartItemId) {
    try {
        const response = await fetch(`${API_BASE}/cart/${cartItemId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadCart();
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

// empty cart button logic
async function emptyCart() {
    try {
        const response = await fetch(`${API_BASE}/cart/emptycart`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadCart();
        }
    } catch (error) {
        console.error('Error emptying cart:', error);
    }
}

// updating the cart items count
async function updateCartCount() {
    try {
        const response = await fetch(`${API_BASE}/cart`);
        const items = await response.json();
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// initializing the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
});