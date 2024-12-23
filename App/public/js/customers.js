// Citations 
// 1) The general structure for this file is based on the CS 340 nodejs-starter-app code
// 2) Date: 12/09/24
// 3) Originality: Adapted (only structurally similar)
// 4) Source: (https://github.com/osu-cs340-ecampus/nodejs-starter-app) 

// public/js/customers.js

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

function showUpdateForm(customerID) {
    const row = document.querySelector(`tr[data-id='${customerID}']`);

    const customerName = row.children[3].innerText;
    const customerEmail = row.children[4].innerText;
    const customerAddress = row.children[5].innerText;
    const phoneNumber = row.children[6].innerText;
    const username = row.children[7].innerText;

    // Assign values to the update form
    document.getElementById('updateCustomerID').value = customerID;
    document.getElementById('updateCustomerName').value = customerName;
    document.getElementById('updateCustomerEmail').value = customerEmail;
    document.getElementById('updateCustomerAddress').value = customerAddress;
    document.getElementById('updatePhoneNumber').value = phoneNumber;
    document.getElementById('updateUsername').value = username;

    // Show the update form
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

document.getElementById('addCustomerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const username = document.getElementById('username').value;

    const data = { customerName, customerEmail, customerAddress, phoneNumber, username };

    fetch('/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert('Error adding customer');
        }
    });
});

document.getElementById('updateCustomerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const customerID = document.getElementById('updateCustomerID').value;
    const customerName = document.getElementById('updateCustomerName').value;
    const customerEmail = document.getElementById('updateCustomerEmail').value;
    const customerAddress = document.getElementById('updateCustomerAddress').value;
    const phoneNumber = document.getElementById('updatePhoneNumber').value;
    const username = document.getElementById('updateUsername').value;

    const data = { customerName, customerEmail, customerAddress, phoneNumber, username };

    fetch(`/customers/${customerID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then((response) => {
            console.log('Response Status:', response.status); 
            if (response.ok) {
                console.log('Update successful');
                location.reload();
            } else {
                return response.text().then((err) => {
                    console.error('Server Response Error:', err);
                    alert('Error updating brand: ' + err);
                });
            }
        })
        .catch((error) => {
            console.error('Network or Fetch Error:', error);
            alert('Error updating brand: ' + error.message);
        });
});

function deleteCustomer(customerID) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    fetch(`/customers/${customerID}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert('Error deleting customer');
        }
    });
}