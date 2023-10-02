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

function loadProducts() {
    return fetch('./data/products.json') // Provide the path to your products.json file
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to load products');
            }
        })
        .then(products => {
            return products;
        })
        .catch(error => {
            console.error(error);
        });
}

function displaySearchResults(products) {
    // Get the searchResults div by its id
    const searchResultsDiv = document.getElementById('searchResults');

    // Check if the div exists
    if (!searchResultsDiv) {
        console.error('searchResults div not found');
        return;
    }

    // Clear any existing results
    searchResultsDiv.innerHTML = '';

    // Loop through the products and add them to the searchResults div
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
        <div class="col-md-4 mb-3">
            <div class="card">
                <img src="${product.image}" class="card-img-top" style="height: 400px; object-fit: cover;" />
            </div>
            <div class="card-body">
                <h2>${product.name}</h2>
                <p>Product ID: #${product.id}</p>
                <p>Price: $${product.price}</p>
                <input type="number" id="prodQty" min="1" value="1" class="form-control mb-2" style="width: 80px;">
                <button class="btn btn-success" onclick="addToCart(${product.id}, document.getElementById('prodQty').value)">Add to Cart</button>
            </div>
        </div>
        `;

        // Append the product div to the searchResults div
        searchResultsDiv.appendChild(productDiv);
    });
}



function searchProducts(query) {
    // Converting query to lowercase and string for comparison
    const lowerCaseQuery = query.toLowerCase();
    const stringQuery = query.toString();

    // loadProducts() returns a promise
    loadProducts().then(products => {
        // Filter products based on the query
        const searchResults = products.filter(product => {
            // Converting id to string for comparison
            const stringId = product.id.toString();

            // Checking both name and id for a match with the query
            return (
                product.name.toLowerCase().includes(lowerCaseQuery) || 
                stringId.includes(stringQuery)
            );
        });

        // Then, you can display these results on your page
        displaySearchResults(searchResults);
    });
}




function handleSearch() {
    const query = document.getElementById('productSearch').value;
    localStorage.setItem('searchQuery', query);
    window.location.href = 'search.html';
}




function addToCart(productId, quantity) {
    fetch('./data/products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(prod => prod.id === productId);
            if (product) {
                quantity = parseInt(quantity);
                if (isNaN(quantity) || quantity < 1) {
                    quantity = 1;
                }
                cart.push({ ...product, quantity });

                // Update the cart in local storage after adding an item.
                localStorage.setItem('cart', JSON.stringify(cart));
                alert(product.name + ' added to cart, Quantity: ' + quantity);
            } else {
                alert('Product not found!');
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}




function checkout(event) {
    event.preventDefault(); // prevent the link from navigating away
    
    // Store cart data to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Now navigate to the order confirmation page
    window.location.href = 'orderConfirmation.html';
}

function confirmOrder() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);  // Multiply by quantity

    const order = {
        items: cart,
        total: total.toFixed(2),
        date: new Date().toLocaleString()
    };

    let previousOrders = JSON.parse(localStorage.getItem('previousOrders')) || [];
    previousOrders.push(order);
    localStorage.setItem('previousOrders', JSON.stringify(previousOrders));

    alert('Order confirmed!');

    window.location.href = 'index.html';

    // Clear the cart in local storage
    localStorage.removeItem('cart');

    // Re-initialize the cart variable to an empty array
    cart = [];
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
    // Fetch the cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    const logoutNav = document.getElementById('logoutNav');
    const registerNav = document.getElementById('registerNav');
    const loginNav = document.getElementById('loginNav');
    const productsSection = document.getElementById('productsSection');
    const checkoutSection = document.getElementById('checkoutSection');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const searchBar = document.getElementById('searchResults')
    const welcomeSection = document.getElementById('welcomeSection')

    // Get the current path
    const pathName = window.location.pathname;
    // Check if the current page is index.html
    const onIndexPage = pathName.endsWith('index.html');
    const onLoginPage = pathName.endsWith('login.html')
    const loginSection = document.getElementById('loginSection')
    
    // Check if logoutNav, registerNav, and loginNav are not null before accessing classList
    if (logoutNav && registerNav && loginNav) {
        if (isLoggedIn === 'true') {
            logoutNav.classList.remove('hidden');
            registerNav.classList.add('hidden');
            loginNav.classList.add('hidden');
        } else {
            logoutNav.classList.add('hidden');
            registerNav.classList.remove('hidden');
            loginNav.classList.remove('hidden');
        }
    }
    if (searchBar) {
        if (isLoggedIn === 'true') {
            searchBar.classList.remove('hidden');
        } else {
            searchBar.classList.add('hidden');
        }
    }
    if (welcomeSection) {
        if (isLoggedIn === 'true') {
            welcomeSection.classList.add('hidden');
        } else {
            welcomeSection.classList.remove('hidden');
        }   
    }

    // Check if productsSection and checkoutSection are not null before accessing classList
    if (productsSection && checkoutSection) {
        if (isLoggedIn === 'true' && onIndexPage) {
            productsSection.classList.remove('hidden'); // making product section visible
            checkoutSection.classList.remove('hidden'); // making checkout section visible
        } else {
            productsSection.classList.add('hidden'); // making product section hidden
            checkoutSection.classList.add('hidden'); // making checkout section hidden

        }
    }
});

