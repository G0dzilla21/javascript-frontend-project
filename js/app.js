// Dummy data for registered users and current logged-in user
const registeredUsers = [];
let loggedInUser = null;
let cart = [];
let previousOrders = JSON.parse(localStorage.getItem('previousOrders')) || [];

// Function to register a user
function registerUser() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const user = {
        username: username,
        password: password
    };
    
    // Save user to localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    existingUsers.push(user);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    alert('User registered successfully!');
    toggleVisibility('registrationSection');
}

// Function to login a user
function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Fetch the users.json file from the server
    fetch('./data/users.json')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Could not fetch users');
            }
        })
        .then(users => {
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                loggedInUser = user;
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password');
            }
        })
        .catch(error => {
            console.error(error);
            alert('An error occurred while fetching users');
        });
}


function logoutUser() {
    localStorage.setItem('isLoggedIn', 'false');
    window.location.href = 'index.html';
}

function addToCart(productId) {
    const productData = {
        1: { name: 'Chair', price: 100 },
        2: { name: 'Table', price: 250 },
        3: { name: 'Sofa', price: 700 }
    };
    cart.push(productData[productId]);
    // Update the cart in local storage after adding an item.
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(productData[productId].name + ' added to cart');
}

function checkout(event) {
    event.preventDefault(); // prevent the link from navigating away
    
    // Store cart data to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Now navigate to the order confirmation page
    window.location.href = 'orderConfirmation.html';
}

function confirmOrder() {
    // Get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Calculate the total
    let total = cart.reduce((sum, item) => sum + item.price, 0);

    // Create an order object including date, items, and total
    const order = {
        items: cart,
        total: total.toFixed(2),
        date: new Date().toLocaleString() // Save the current date and time as a string
    };

    // Retrieve existing orders from localStorage or initialize an empty array
    let previousOrders = JSON.parse(localStorage.getItem('previousOrders')) || [];

    // Add the new order to the array of previous orders
    previousOrders.push(order);

    // Save the updated previous orders back to localStorage
    localStorage.setItem('previousOrders', JSON.stringify(previousOrders));

    // Provide confirmation alert to the user
    alert('Order confirmed!');

    // Clear the cart variable
    cart = [];

    // Clear the cart in local storage
    localStorage.removeItem('cart');

    // Update the cart display
    updateCartDisplay();
}


function updateCartDisplay() {
    // Fetch the cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Now update the cart display on the page
    // You can write the logic to update the cart display here
    // For example, updating the cart counter, cart items, etc.
}


// Function to toggle visibility of sections
function toggleVisibility(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.toggle('hidden');
    }
}

window.addEventListener('load', function () {
    const logoutNav = document.getElementById('logoutNav');
    const registerNav = document.getElementById('registerNav');
    const loginNav = document.getElementById('loginNav');
    const productsSection = document.getElementById('productsSection');
    const checkoutSection = document.getElementById('checkoutSection');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
        logoutNav.classList.remove('hidden');
        registerNav.classList.add('hidden');
        loginNav.classList.add('hidden');
        productsSection.classList.remove('hidden'); // making product section visible
        checkoutSection.classList.remove('hidden'); // making checkout section visible
    } else {
        logoutNav.classList.add('hidden');
        registerNav.classList.remove('hidden');
        loginNav.classList.remove('hidden');
        productsSection.classList.add('hidden'); // making product section hidden
        checkoutSection.classList.add('hidden'); // making checkout section hidden
    }
  
    if (registerBtn) {
      registerBtn.addEventListener('click', function () {
        toggleVisibility('registrationSection');
      });
    }
  
    if (loginBtn) {
      loginBtn.addEventListener('click', function () {
        toggleVisibility('loginSection');
      });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
});
  
