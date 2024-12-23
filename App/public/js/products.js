
// public/js/products.js

// Citations 
// 1) The general structure for this file is based on the CS 340 nodejs-starter-app code
// 2) Date: 12/09/24
// 3) Originality: Adapted (only structurally similar)
// 4) Source: (https://github.com/osu-cs340-ecampus/nodejs-starter-app) 

// Add form
function showAddForm() {
    document.getElementById('add-form').style.display = 'block';
    document.getElementById('browse').style.display = 'none';
}

function hideAddForm() {
    document.getElementById('add-form').style.display = 'none';
    document.getElementById('browse').style.display = 'block';

    document.getElementById('browse').style.display = 'flex';  
    document.getElementById('browse').style.justifyContent = 'center';  
    document.getElementById('browse').style.alignItems = 'center'; 
    document.getElementById('browse').style.height = 'auto'; 
}

// Update form
function showUpdateForm(productID) {
    const row = document.querySelector(`tr[data-id='${productID}']`);

    const productName = row.children[3].innerText;
    const description = row.children[4].innerText;
    const price = row.children[5].innerText;
    const categoryName = row.children[6].innerText;
    const stockQuantity = row.children[7].innerText;
    const supplierID = row.children[8].innerText;
    const brandID = row.children[9].innerText;

    document.getElementById('updateProductID').value = productID; 
    document.getElementById('updateProductName').value = productName;
    document.getElementById('updateDescription').value = description;
    document.getElementById('updatePrice').value = price;
    document.getElementById('updateCategoryName').value = categoryName;
    document.getElementById('updateStockQuantity').value = stockQuantity;
    document.getElementById('updateSupplierID').value = supplierID;
    document.getElementById('updateBrandID').value = brandID;

    document.getElementById('update-form').style.display = 'block';
    document.getElementById('browse').style.display = 'none';
}


function hideUpdateForm() {
    document.getElementById('update-form').style.display = 'none';
    document.getElementById('browse').style.display = 'block';

    document.getElementById('browse').style.display = 'flex';  
    document.getElementById('browse').style.justifyContent = 'center';  
    document.getElementById('browse').style.alignItems = 'center'; 
    document.getElementById('browse').style.height = 'auto'; 
}

document.getElementById('addProductForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const productName = document.getElementById('productName').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const categoryName = document.getElementById('categoryName').value;
    const stockQuantity = document.getElementById('stockQuantity').value;
    const supplierID = document.getElementById('supplierID').value;
    const brandID = document.getElementById('brandID').value;

    const productID = document.getElementById('updateProductID').value;  
    const data = {
        productID,  
        productName,
        description,
        price,
        categoryName,
        stockQuantity,
        supplierID,
        brandID
    };

    fetch('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert('Error adding product');
        }
    });
});

document.getElementById('updateProductForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const productID = document.getElementById('updateProductID').value;
    const productName = document.getElementById('updateProductName').value;
    const description = document.getElementById('updateDescription').value;
    const price = document.getElementById('updatePrice').value;
    const categoryName = document.getElementById('updateCategoryName').value;
    const stockQuantity = document.getElementById('updateStockQuantity').value;
    const supplierID = document.getElementById('updateSupplierID').value;
    const brandID = document.getElementById('updateBrandID').value;

    const data = { 
        productName, 
        description, 
        price, 
        categoryName, 
        stockQuantity, 
        supplierID, 
        brandID 
    };

    fetch(`/products/${productID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            // After successful update, update the table row
            updateTableRow(productID, productName, description, price, categoryName, stockQuantity, supplierID, brandID);
            location.reload();  // Or simply hide the form without reloading
        } else {
            alert('Error updating product');
        }
    });
});

function updateTableRow(productID, productName, description, price, categoryName, stockQuantity, supplierID, brandID) {
    // Find the row for this product in the table
    const row = document.querySelector(`tr[data-id='${productID}']`);
    
    // Update the row with the new values
    row.children[3].innerText = productName;
    row.children[4].innerText = description;
    row.children[5].innerText = price;
    row.children[6].innerText = categoryName;
    row.children[7].innerText = stockQuantity;
    
    // Fetch the supplier and brand names based on the IDs
    const supplierName = getSupplierNameById(supplierID);  // You'll need a function that fetches the name by ID
    const brandName = getBrandNameById(brandID);  // Similar function for brands

    row.children[8].innerText = supplierName;  // Assuming column 8 is for supplier name
    row.children[9].innerText = brandName;  // Assuming column 9 is for brand name
}

function getSupplierNameById(supplierID) {
    // You'll need to either have this data available in your app or fetch it from the server.
    // For now, let's assume you have the supplier names somewhere in the JavaScript.
    const suppliers = [
        { supplierID: 1, supplierName: 'Supplier A' },
        { supplierID: 2, supplierName: 'Supplier B' }
    ];
    const supplier = suppliers.find(supplier => supplier.supplierID == supplierID);
    return supplier ? supplier.supplierName : 'Unknown Supplier';
}

function getBrandNameById(brandID) {
    // Similarly, you need to fetch or store the brand names by ID.
    const brands = [
        { brandID: 1, brandName: 'Brand X' },
        { brandID: 2, brandName: 'Brand Y' }
    ];
    const brand = brands.find(brand => brand.brandID == brandID);
    return brand ? brand.brandName : 'Unknown Brand';
}


function deleteProduct(productID) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    fetch(`/products/${productID}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert('Error deleting product');
        }
    });
}