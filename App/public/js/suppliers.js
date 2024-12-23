// public/js/supplers.js

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
    document.getElementById('browse').style.display = 'flex';
    document.getElementById('browse').style.justifyContent = 'center';
    document.getElementById('browse').style.alignItems = 'center';
    document.getElementById('browse').style.height = 'auto';
}

// Update form
function showUpdateForm(supplierID) {
    const row = document.querySelector(`tr[data-id='${supplierID}']`);
    const supplierName = row.children[3].innerText;
    const contactInfo = row.children[4].innerText;
    const supplierAddress = row.children[5].innerText;

    document.getElementById('updateSupplierID').value = supplierID;
    document.getElementById('updateSupplierName').value = supplierName;
    document.getElementById('updateContactInfo').value = contactInfo;
    document.getElementById('updateSupplierAddress').value = supplierAddress;

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

document.getElementById('addSupplierForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const supplierName = document.getElementById('supplierName').value;
    const contactInfo = document.getElementById('contactInfo').value;
    const supplierAddress = document.getElementById('supplierAddress').value;

    const data = { supplierName, contactInfo, supplierAddress };

    fetch('/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert('Error adding supplier');
        }
    });
});

document.getElementById('updateSupplierForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const supplierID = document.getElementById('updateSupplierName').value; // Gets the selected supplierID
    const supplierName = document.getElementById('updateSupplierName').selectedOptions[0].text; // Gets the supplierName

    console.log('Selected ID:', supplierID);
    console.log('Selected Name:', supplierName);
    
    const contactInfo = document.getElementById('updateContactInfo').value;
    const supplierAddress = document.getElementById('updateSupplierAddress').value;

    const data = { supplierName, contactInfo, supplierAddress };

    fetch(`/suppliers/${supplierID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }) .then((response) => {
        console.log('Response Status:', response.status); // Check status code
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

function deleteSupplier(supplierID) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    fetch(`/suppliers/${supplierID}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert('Error deleting supplier');
        }
    });
}