let admin = { username: "admin", password: "admin" };

function adminLogin(username, password) {
  if (username === admin.username && password === admin.password) {
    alert('Admin login successful!');
  } else {
    alert('Invalid admin credentials.');
  }
}

function editProduct(productId, updatedInfo) {
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...updatedInfo };
    alert('Product updated successfully!');
  } else {
    alert('Product not found.');
  }
}

// Sample Usage
adminLogin('admin', 'admin');
editProduct(1, { name: "New Chair", price: 120 });
