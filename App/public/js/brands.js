// Citations 
// 1) The general structure for this file is based on the CS 340 nodejs-starter-app code
// 2) Date: 12/09/24
// 3) Originality: Adapted (only structurally similar)
// 4) Source: (https://github.com/osu-cs340-ecampus/nodejs-starter-app) 

// public/js/brands.js


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

function showUpdateForm(brandID) {
    const row = document.querySelector(`tr[data-id='${brandID}']`);

    const brandName = row.children[3].innerText;
    const contactInfo = row.children[4].innerText;
    const relationshipType = row.children[5].innerText;

    // Assign values to the update form
    document.getElementById('updateBrandName').value = brandName;
    document.getElementById('updateContactInfo').value = contactInfo;
    document.getElementById('updateRelationshipType').value = relationshipType;
    document.getElementById('updateBrandID').value = brandID; 

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

document.getElementById('addBrandForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const brandName = document.getElementById('brandName').value;
    const contactInfo = document.getElementById('contactInfo').value;
    const relationshipType = document.getElementById('relationshipType').value;

    const data = { brandName, contactInfo, relationshipType };

    fetch('/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert('Error adding brand');
        }
    });
});

document.getElementById('updateBrandForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const brandID = document.getElementById('updateBrandID').value; 
    const brandName = document.getElementById('updateBrandName').value;
    const contactInfo = document.getElementById('updateContactInfo').value;
    const relationshipType = document.getElementById('updateRelationshipType').value;

    const data = { brandName, contactInfo, relationshipType };

    console.log('Sending data:', data); 
    console.log('Requesting URL:', `/brands/${brandID}`); 

    fetch(`/brands/${brandID}`, {
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

function deleteBrand(brandID) {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    fetch(`/brands/${brandID}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert('Error deleting brand');
        }
    });
}