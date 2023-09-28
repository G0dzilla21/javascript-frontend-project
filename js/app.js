// Dummy data for registered users and current logged-in user
const registeredUsers = [];
let loggedInUser = null;
let cart = [];
let previousOrders = [];

// Function to register a user
function registerUser() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const user = {
        username: username,
        password: password
    };
    registeredUsers.push(user);
    alert('User registered successfully!');
    toggleVisibility('registrationSection');
}

// Function to login a user
function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const user = registeredUsers.find(u => u.username === username && u.password === password);
    if (user) {
        loggedInUser = user;
        document.getElementById('productsSection').classList.remove('hidden');
        document.getElementById('checkoutSection').classList.remove('hidden');
        document.getElementById('links').classList.add('hidden');
        alert('Login successful!');
    } else {
        alert('Invalid username or password');
    }
}

// Function to add items to cart
function addToCart(productId) {
    const productData = {
        1: { name: 'Chair', price: 100 },
        2: { name: 'Table', price: 250 },
        3: { name: 'Sofa', price: 700 }
    };
    cart.push(productData[productId]);
    alert(productData[productId].name + ' added to cart');
}

// Function for checkout
function checkout() {
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    const discount = total > 2000 ? total * 0.1 : 0;
    total -= discount;

    document.getElementById('orderSummary').innerHTML = `
        <p>Total: $${total.toFixed(2)}</p>
        ${discount > 0 ? `<p>Discount: $${discount.toFixed(2)}</p>` : ''}
        <ul>${cart.map(item => `<li>${item.name} - $${item.price}</li>`).join('')}</ul>
    `;
    toggleVisibility('orderConfirmationSection');
}

// Function to confirm order
function confirmOrder() {
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    if (total > 2000) {
        total *= 0.9;
    }
    const orderSummary = {
        total: total.toFixed(2),
        items: cart
    };
    previousOrders.push(orderSummary);
    cart = [];
    toggleVisibility('orderConfirmationSection');
    alert('Order confirmed!');
}


// Function to view previous orders
function viewPreviousOrders() {
    document.getElementById('previousOrders').innerHTML = previousOrders
        .map((order, index) => `
            <p>Order ${index + 1}:</p>
            <p>Total: $${order.total}</p>
            <ul>${order.items.map(item => `<li>${item.name} - $${item.price}</li>`).join('')}</ul>
        `)
        .join('');
    toggleVisibility('previousOrdersSection');
}

// Function to toggle visibility of sections
function toggleVisibility(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('hidden');
}

// Add event listeners after the document has fully loaded
window.onload = function () {
    document.getElementById('registerBtn').addEventListener('click', function () {
        toggleVisibility('registrationSection')
    });
    document.getElementById('loginBtn').addEventListener('click', function () {
        toggleVisibility('loginSection')
    });
};
