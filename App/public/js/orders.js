// Citations 
// 1) The general structure for this file is based on the CS 340 nodejs-starter-app code
// 2) Date: 12/09/24
// 3) Originality: Adapted (only structurally similar)
// 4) Source: (https://github.com/osu-cs340-ecampus/nodejs-starter-app) 

// public/js/orders.js

function showAddForm() {
    document.getElementById('add-form').style.display = 'block';
    document.getElementById('browse').style.display = 'none';
}

function hideAddForm() {
    document.getElementById('add-form').style.display = 'none';
    document.getElementById('browse').style.display = 'flex';
    document.getElementById('browse').style.justifyContent = 'center';
    document.getElementById('browse').style.alignItems = 'center';
    document.getElementById('browse').style.height = 'auto';
}

function showUpdateForm(orderID) {
    const row = document.querySelector(`tr[data-id='${orderID}']`);

    const orderDate = row.children[3].innerText;
    const shippingDate = row.children[4].innerText;
    const status = row.children[5].innerText;
    const totalAmount = row.children[6].innerText;
    const customerID = row.children[7].innerText;

    document.getElementById('updateOrderID').value = orderID;
    document.getElementById('updateOrderDate').value = orderDate;
    document.getElementById('updateShippingDate').value = shippingDate;
    document.getElementById('updateStatus').value = status; // Set dropdown value
    document.getElementById('updateTotalAmount').value = totalAmount;
    document.getElementById('updateCustomerID').value = customerID;

    document.getElementById('update-form').style.display = 'block';
    document.getElementById('browse').style.display = 'none';
}

function hideUpdateForm() {
    document.getElementById('update-form').style.display = 'none';
    document.getElementById('browse').style.display = 'flex';
    document.getElementById('browse').style.justifyContent = 'center';
    document.getElementById('browse').style.alignItems = 'center';
    document.getElementById('browse').style.height = 'auto';
}

document.getElementById('addOrderForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const orderDate = document.getElementById('orderDate').value;
    const shippingDate = document.getElementById('shippingDate').value;
    const status = document.getElementById('status').value;
    const totalAmount = document.getElementById('totalAmount').value;
    const customerID = document.getElementById('customerID').value;

    const data = {
        orderDate,
        shippingDate,
        status,
        totalAmount,
        customerID
    };

    // Send the data to the server
    fetch('/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            window.location.reload(); 
        } else {
            alert('Failed to add order. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the order.');
    });
});


document.getElementById('updateOrderForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const orderID = document.getElementById('updateOrderID').value;
    const orderDate = document.getElementById('updateOrderDate').value;
    const shippingDate = document.getElementById('updateShippingDate').value;
    const status = document.getElementById('updateStatus').value;
    const totalAmount = document.getElementById('updateTotalAmount').value;
    const customerID = document.getElementById('updateCustomerID').value;

    if (!orderID || !orderDate || !shippingDate || !status || !totalAmount || !customerID) {
        alert('Please fill in all fields.');
        return;
    }

    const data = { orderDate, shippingDate, status, totalAmount, customerID };

    fetch(`/orders/${orderID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                location.reload();
            } else {
                return response.text().then((err) => {
                    alert('Error updating order: ' + err);
                });
            }
        })
        .catch((error) => {
            alert('Error updating order: ' + error.message);
        });
});

function deleteOrder(orderID) {
    if (!confirm('Are you sure you want to delete this order?')) return;

    fetch(`/orders/${orderID}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert('Error deleting order');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.order-date').forEach((cell) => {
        const rawDate = cell.innerText;
        cell.innerText = formatDate(rawDate);
    });

    document.querySelectorAll('.shipping-date').forEach((cell) => {
        const rawDate = cell.innerText;
        cell.innerText = formatDate(rawDate);
    });
});

function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) {
        return dateString;
    }
    return date.toISOString().split('T')[0];
}
