// Citations 
// 1) The general structure for this file is based on the CS 340 nodejs-starter-app code
// 2) Date: 12/09/24
// 3) Originality: Adapted (only structurally similar)
// 4) Source: (https://github.com/osu-cs340-ecampus/nodejs-starter-app) 

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

function showUpdateForm(instanceID) {
    const row = document.querySelector(`tr[data-id='${instanceID}']`);
    const orderID = row.children[3].innerText;
    const productID = row.children[4].innerText;
    const serialNumber = row.children[5].innerText;

    document.getElementById('updateInstanceID').value = instanceID;
    document.getElementById('updateOrderID').value = orderID;
    document.getElementById('updateProductID').value = productID;
    document.getElementById('updateSerialNumber').value = serialNumber;

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

document.getElementById('addProductInstanceForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const orderID = document.getElementById('orderID').value || null;
    const productID = document.getElementById('productID').value;
    const serialNumber = document.getElementById('serialNumber').value;

    const data = { orderID, productID, serialNumber };

    fetch('/productInstances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert('Error adding product instance');
        }
    });
});

document.getElementById('updateProductInstanceForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const instanceID = document.getElementById('updateInstanceID').value;
    const serialNumber = document.getElementById('updateSerialNumber').value;

    const data = { serialNumber };

    fetch(`/productInstances/${instanceID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert('Error updating product instance');
        }
    });
});

function deleteProductInstance(instanceID) {
    if (!confirm('Are you sure you want to delete this product instance?')) return;

    fetch(`/productInstances/${instanceID}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert('Error deleting product instance');
        }
    });
}