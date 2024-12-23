// Citations 
// 1) The general structure for this file is based on the CS 340 nodejs-starter-app code
// 2) Date: 12/09/24
// 3) Originality: Adapted (only structurally similar)
// 4) Source: (https://github.com/osu-cs340-ecampus/nodejs-starter-app) 

// public/js/orderProducts.js

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

function showUpdateForm(orderProductID) {
    const row = document.querySelector(`tr[data-id='${orderProductID}']`);

    const orderID = row.children[3].innerText;
    const productID = row.children[4].innerText;
    const quantity = row.children[5].innerText;
    const unitPrice = row.children[6].innerText;
    const totalPrice = row.children[7].innerText;
    const orderDate = row.children[8].innerText;

    document.getElementById('updateOrderProductID').value = orderProductID; 
    document.getElementById('updateOrderID').value = orderID;
    document.getElementById('updateProductID').value = productID;
    document.getElementById('updateQuantity').value = quantity;
    document.getElementById('updateUnitPrice').value = unitPrice;
    document.getElementById('updateTotalPrice').value = totalPrice;
    document.getElementById('updateOrderDate').value = orderDate;

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

// Calculate and update the totalPrice dynamically
document.getElementById('unitPrice').addEventListener('input', updateTotalPrice);
document.getElementById('quantity').addEventListener('input', updateTotalPrice);


function updateTotalPrice() {
    const quantity = parseFloat(document.getElementById('quantity').value) || 0;
    const unitPrice = parseFloat(document.getElementById('unitPrice').value) || 0;
    const totalPrice = quantity * unitPrice;
    document.getElementById('totalPrice').value = totalPrice.toFixed(2); 
}

// Form submission handler
document.getElementById('addOrderProductForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const orderID = document.getElementById('orderID').value;
    const productID = document.getElementById('productID').value;
    const quantity = document.getElementById('quantity').value;
    const unitPrice = document.getElementById('unitPrice').value;
    const totalPrice = document.getElementById('totalPrice').value;
    const orderDate = document.getElementById('orderDate').value;

    const data = {
        orderID,
        productID,
        quantity,
        unitPrice,
        totalPrice,
        orderDate
    };

    fetch('/orderProducts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            location.reload(); // Reload the page to show the new row
        } else {
            alert('Error adding product');
        }
    });
});


// This function will be triggered when the form is loaded
function calculateTotalPrice() {
    const quantity = document.getElementById('updateQuantity').value;
    const unitPrice = document.getElementById('updateUnitPrice').value;
    const totalPriceField = document.getElementById('updateTotalPrice');

    if (quantity && unitPrice) {
        // Calculate total price
        totalPriceField.value = (quantity * unitPrice).toFixed(2); // Rounded to 2 decimal places
    }
}

// Attach event listeners for `quantity` and `unitPrice` fields
document.getElementById('updateQuantity').addEventListener('input', calculateTotalPrice);
document.getElementById('updateUnitPrice').addEventListener('input', calculateTotalPrice);

// Call `calculateTotalPrice` to initialize the field when the form is loaded
document.addEventListener('DOMContentLoaded', function () {
    calculateTotalPrice();
});

document.getElementById('updateOrderProductForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the values from the form fields
    const orderProductID = document.getElementById('updateOrderProductID').value;
    const orderID = document.getElementById('updateOrderID').value;
    const productID = document.getElementById('updateProductID').value;
    const quantity = parseFloat(document.getElementById('updateQuantity').value); // Ensure quantity is a number
    const unitPrice = parseFloat(document.getElementById('updateUnitPrice').value); // Ensure unit price is a number
    const totalPrice = quantity * unitPrice;  // Dynamically calculate the total price
    const orderDate = document.getElementById('updateOrderDate').value;

    const data = {
        orderID,
        productID,
        quantity,
        unitPrice,
        totalPrice,  // Send the dynamically calculated total price
        orderDate
    };

    // Send a PUT request to update the order product
    fetch(`/orderProducts/${orderProductID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            // If successful, update the table row
            updateTableRow(orderProductID, orderID, productID, quantity, unitPrice, totalPrice, orderDate);
            location.reload();  // Reload the page to reflect changes or you could just hide the form
        } else {
            alert('Error updating product');
        }
    });
});




function deleteOrderProduct(orderProductID) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    fetch(`/orderProducts/${orderProductID}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert('Error deleting order product');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Format the orderDate in the table cells
    document.querySelectorAll('.order-date').forEach((cell) => {
        const rawDate = cell.innerText; // Original date text
        cell.innerText = formatDate(rawDate); // Format and replace
    });

    // Format the orderDate in the orderDate dropdown
    document.querySelectorAll('#orderDate option').forEach((option) => {
        const rawDate = option.innerText; // Get the original date text
        option.innerText = formatDate(rawDate); // Format and replace the option's text
    });
});

function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) {
        console.error('Invalid date:', dateString); // Log invalid dates
        return dateString; // Return the original value if invalid
    }
    return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
}



