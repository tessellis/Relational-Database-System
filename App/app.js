// app.js

/*
    SETUP
*/
const express = require('express');
const app = express();
const PORT = 65346;

// Database
const db = require('./database/db-connector');

const handlebars = require('handlebars');

// Register the eq helper
handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

// Handlebars
const { engine } = require('express-handlebars');
app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

/*
    ROUTES
*/

// Home Page
app.get('/', (req, res) => {
    res.render('index');
});


// Entities Page
app.get('/entities', (req, res) => {
    res.render('entities');
});

app.get('/overviewPage', (req, res) => {
    res.render('overviewPage');
});

app.get('/projectOverview', (req, res) => {
    res.render('projectOverview', { title: 'Project Overview' });
});




/*
    CUSTOMERS
*/

// GET /customers
app.get('/customers', (req, res) => {
    const queryCustomers = `
        SELECT * FROM Customers;
    `;
    db.pool.query(queryCustomers, (error, customersRows) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
        } else {
            res.render('customers', {
                data: customersRows
            });
        }
    });
});

// POST /customers
app.post('/customers', (req, res) => {
    const { customerName, customerEmail, customerAddress, phoneNumber, username } = req.body;

    const queryInsertCustomer = `
        INSERT INTO Customers (customerName, customerEmail, customerAddress, phoneNumber, username)
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    db.pool.query(queryInsertCustomer, [customerName, customerEmail, customerAddress, phoneNumber, username], (error, results) => {
        if (error) {
            console.error(error);
            res.redirect('/customers');
        } else {
            res.redirect('/customers');
        }
    });
});

// PUT /customers/:id
app.put('/customers/:id', (req, res) => {
    const customerID = req.params.id;
    const { customerName, customerEmail, customerAddress, phoneNumber, username } = req.body;

    const queryUpdateCustomer = `
        UPDATE Customers
        SET customerName = ?, customerEmail = ?, customerAddress = ?, phoneNumber = ?, username = ? = ?
        WHERE customerID = ?;
    `;

    db.pool.query(queryUpdateCustomer, [customerName, customerEmail, customerAddress, phoneNumber, username, customerID], (error, results) => {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});

// DELETE /customers/:id
app.delete('/customers/:id', (req, res) => {
    const customerID = req.params.id;

    const queryDeleteCustomer = `
        DELETE FROM Customers WHERE customerID = ?;
    `;

    db.pool.query(queryDeleteCustomer, [customerID], (error, results) => {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});

/*
    BRANDS
*/

// GET /brands
// GET /brands (for populating the add brand form)
app.get('/brands', (req, res) => {
    const queryBrands = `
        SELECT * FROM Brands;
    `;

    // Get all brands
    db.pool.query(queryBrands, (error, brandsRows) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
        } else {
            // Query for distinct relationshipTypes
            const queryRelationshipTypes = `
                SELECT DISTINCT relationshipType FROM Brands WHERE relationshipType IS NOT NULL;
            `;

            db.pool.query(queryRelationshipTypes, (error, relationshipTypesRows) => {
                if (error) {
                    console.error(error);
                    res.sendStatus(500);
                } else {
                    console.log('Relationship Types:', relationshipTypesRows); // Add this log to verify the data
                    res.render('brands', {
                        data: brandsRows,
                        relationshipTypes: relationshipTypesRows
                    });
                }
            });
        }
    });
});



// POST /brands
app.post('/brands', (req, res) => {
    const { brandName, contactInfo, relationshipType } = req.body;

    const queryInsertBrand = `
        INSERT INTO Brands (brandName, contactInfo, relationshipType)
        VALUES (?, ?, ?);
    `;

    db.pool.query(queryInsertBrand, [brandName, contactInfo, relationshipType], (error, results) => {
        if (error) {
            console.error(error);
            res.redirect('/brands');
        } else {
            res.redirect('/brands');
        }
    });
});

// PUT /brands/:id
app.put('/brands/:id', (req, res) => {
    const brandID = req.params.id;
    const { contactInfo, relationshipType } = req.body;

    const queryUpdateBrand = `
        UPDATE Brands
        SET contactInfo = ?, relationshipType = ?
        WHERE brandID = ?;
    `;

    db.pool.query(queryUpdateBrand, [contactInfo, relationshipType, brandID], (error, results) => {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});


// DELETE /brands/:id
app.delete('/brands/:id', (req, res) => {
    const brandID = req.params.id;

    const queryDeleteBrand = `
        DELETE FROM Brands WHERE brandID = ?;
    `;

    db.pool.query(queryDeleteBrand, [brandID], (error, results) => {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});

/*
    PRODUCTS
*/

app.get('/products', (req, res) => {
    const queryProducts = `
        SELECT 
            Products.productID, 
            Products.productName, 
            Products.description, 
            Products.price, 
            Products.categoryName, 
            Products.stockQuantity, 
            Suppliers.supplierID, 
            Suppliers.supplierName,  -- Fetch supplierName
            Brands.brandID, 
            Brands.brandName         -- Fetch brandName
        FROM Products
        LEFT JOIN Suppliers ON Products.supplierID = Suppliers.supplierID
        LEFT JOIN Brands ON Products.brandID = Brands.brandID;
    `;

    const querySuppliers = `SELECT supplierID, supplierName FROM Suppliers;`;
    const queryBrands = `SELECT brandID, brandName FROM Brands;`;

    db.pool.query(queryProducts, (error, productsRows) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
        } else {
            db.pool.query(querySuppliers, (error, suppliersRows) => {
                if (error) {
                    console.error(error);
                    res.sendStatus(500);
                } else {
                    db.pool.query(queryBrands, (error, brandsRows) => {
                        if (error) {
                            console.error(error);
                            res.sendStatus(500);
                        } else {
                            res.render('products', {
                                data: productsRows,
                                suppliers: suppliersRows,
                                brands: brandsRows
                            });
                        }
                    });
                }
            });
        }
    });
});


app.post('/products', (req, res) => {
    const { productName, description, price, categoryName, stockQuantity, supplierID, brandID } = req.body;

    const queryInsertProduct = `
        INSERT INTO Products (productName, description, price, categoryName, stockQuantity, supplierID, brandID)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    db.pool.query(queryInsertProduct, [productName, description, price, categoryName, stockQuantity, supplierID, brandID], (error, results) => {
        if (error) {
            console.error(error);
            res.redirect('/products');
        } else {
            res.redirect('/products');
        }
    });
});

app.put('/products/:id', (req, res) => {
    const productID = req.params.id;
    const { productName, description, price, categoryName, stockQuantity, supplierID, brandID } = req.body;

    const queryUpdateProduct = `
        UPDATE Products
        SET productName = ?, 
            description = ?, 
            price = ?, 
            categoryName = ?, 
            stockQuantity = ?, 
            supplierID = ?, 
            brandID = ?
        WHERE productID = ?;
    `;

    db.pool.query(queryUpdateProduct, [productName, description, price, categoryName, stockQuantity, supplierID, brandID, productID], (error, results) => {
        if (error) {
            console.error("Error updating product:", error);
            res.status(500).send("Error updating product");
        } else {
            res.sendStatus(200);
        }
    });
});

// DELETE /products/:id
app.delete('/products/:id', (req, res) => {
    const productID = req.params.id;

    const queryDeleteProduct = `
        DELETE FROM Products WHERE productID = ?;
    `;

    db.pool.query(queryDeleteProduct, [productID], (error, results) => {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});

/*
    SUPPLIERS
*/

// GET /suppliers
app.get('/suppliers', (req, res) => {
    const querySuppliers = `
        SELECT * FROM Suppliers;
    `;
    db.pool.query(querySuppliers, (error, suppliersRows) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
        } else {
            res.render('suppliers', {
                data: suppliersRows,      // For rendering the table or other details
                suppliers: suppliersRows  // For rendering the dropdown
            });
        }
    });
});


// POST /suppliers
app.post('/suppliers', (req, res) => {
    const { supplierName, contactInfo, supplierAddress } = req.body;

    const queryInsertSupplier = `
        INSERT INTO Suppliers (supplierName, contactInfo, supplierAddress)
        VALUES (?, ?, ?);
    `;

    db.pool.query(queryInsertSupplier, [supplierName, contactInfo, supplierAddress], (error, results) => {
        if (error) {
            console.error(error);
            res.redirect('/suppliers');
        } else {
            res.redirect('/suppliers');
        }
    });
});

// PUT /suppliers/:id
app.put('/suppliers/:id', (req, res) => {
    const supplierID = req.params.id;
    const { supplierName, contactInfo, supplierAddress } = req.body;
const queryUpdateSupplier = `
    UPDATE Suppliers
    SET supplierName = ?, contactInfo = ?, supplierAddress = ?
    WHERE supplierID = ?;
`;

db.pool.query(queryUpdateSupplier, [supplierName, contactInfo, supplierAddress, supplierID], (error, results) => {
    if (error) {
        console.error("Error updating supplier:", error);
        res.status(500).send("Error updating supplier");
    } else {
        res.sendStatus(200);
    }
});
});

// DELETE /suppliers/:id
app.delete('/suppliers/:id', (req, res) => {
    const supplierID = req.params.id;

    const queryDeleteSupplier = `
        DELETE FROM Suppliers WHERE supplierID = ?;
    `;

    db.pool.query(queryDeleteSupplier, [supplierID], (error, results) => {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});

/*
    ORDERS

*/

// GET /orders
app.get('/orders', (req, res) => {
    const queryOrders = `
        SELECT 
            Orders.orderID, 
            Orders.orderDate,
            Orders.shippingDate, 
            Orders.status, 
            Orders.totalAmount, 
            Customers.customerID,
            Customers.customerName
        FROM Orders
        LEFT JOIN Customers ON Orders.customerID = Customers.customerID;
    `;

    const queryCustomers = 'SELECT customerID, customerName FROM Customers;';

    // Query the orders first
    db.pool.query(queryOrders, (error, ordersRows) => { // Renamed the variable to 'ordersRows'
        if (error) {
            console.error(error);
            res.sendStatus(500);
        } else {
            // Query the customers
            db.pool.query(queryCustomers, (error, customersRows) => { // Renamed the variable to 'customersRows'
                if (error) {
                    console.error(error);
                    res.sendStatus(500);
                } else {
                    // Send the data to the view
                    res.render('orders', {
                        data: ordersRows, // 'ordersRows' should be passed here
                        customers: customersRows // 'customersRows' should be passed here
                    });
                }
            });
        }
    });
});



// POST /orders
app.post('/orders', (req, res) => {
    const { orderDate, shippingDate, status, totalAmount, customerID } = req.body;

    const queryInsertOrder = `
        INSERT INTO Orders (orderDate, shippingDate, status, totalAmount, customerID)
        VALUES (?, ?, ?, ?, ?);
    `;

    db.pool.query(queryInsertOrder, [orderDate, shippingDate, status, totalAmount, customerID], (error, results) => { // Corrected line
        if (error) {
            console.error(error);
            res.redirect('/orders'); // Redirect on error may not be appropriate; consider sending an error response
        } else {
            res.redirect('/orders');
        }
    });
});


app.put('/orders/:id', (req, res) => {
    const orderID = req.params.id; // Extract the orderID from the URL
    const { orderDate, shippingDate, status, totalAmount, customerID } = req.body; // Ensure the request body matches expected fields

    const queryUpdateOrder = `
        UPDATE Orders
        SET orderDate = ?, 
            shippingDate = ?, 
            status = ?, 
            totalAmount = ?, 
            customerID = ?
        WHERE orderID = ?;
    `;

    db.pool.query(queryUpdateOrder, [orderDate, shippingDate, status, totalAmount, customerID, orderID], (error, results) => {
        if (error) {
            console.error("Database error:", error);
            res.status(400).send("Failed to update order."); // Provide a useful error message
        } else {
            res.status(200).send("Order updated successfully.");
        }
    });

});


// DELETE /orders/:id
app.delete('/orders/:id', (req, res) => {
    const orderID = req.params.id;

    const queryDeleteOrder = `
        DELETE FROM Orders WHERE orderID = ?;
    `;

    db.pool.query(queryDeleteOrder, [orderID], (error, results) => {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});

/*
    OrderProducts
*/

app.get('/orderProducts', (req, res) => {
    const queryOrderProducts = `
    SELECT 
        OrderProducts.orderProductID,
        Orders.orderID,
        Products.productID,
        Products.productName,
        OrderProducts.quantity,
        OrderProducts.unitPrice,
        OrderProducts.totalPrice,
        Orders.orderDate
    FROM OrderProducts
        LEFT JOIN Orders ON OrderProducts.orderID = Orders.orderID
        LEFT JOIN Products ON OrderProducts.productID = Products.productID;
    `;

    const queryOrders = `SELECT orderID, orderDate FROM Orders;`;
    const queryProducts = `SELECT productID, productName FROM Products;`;

    db.pool.query(queryOrderProducts, (error, orderProductsRows) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
        } else {
            db.pool.query(queryOrders, (error, orderRows) => {
                if (error) {
                    console.error(error);
                    res.sendStatus(500);
                } else {
                    db.pool.query(queryProducts, (error, productsRows) => {
                        if (error) {
                            console.error(error);
                            res.sendStatus(500);
                        } else {
                            res.render('orderProducts', {
                                data: orderProductsRows,
                                orders: orderRows,
                                products: productsRows // Correct key here
                            });
                        }
                    });
                }
            });
        }
    });
});

app.get('/getProductName/:productID', (req, res) => {
    const productID = req.params.productID;
    const query = 'SELECT productName FROM Products WHERE productID = ?';

    db.pool.query(query, [productID], (error, result) => {
        if (error) {
            console.error('Error fetching product name:', error);
            res.status(500).send('Error fetching product name');
        } else {
            res.json({ productName: result[0]?.productName || 'Unknown Product' });
        }
    });
});



app.post('/orderProducts', (req, res) => {
    const { orderID, productID, quantity, unitPrice, totalPrice, orderDate } = req.body;

        const queryInsertOrderProduct = `
        INSERT INTO OrderProducts (orderID, productID, quantity, unitPrice, totalPrice)
        VALUES (?, ?, ?, ?, ?);
    `;

    db.pool.query(queryInsertOrderProduct, [orderID, productID, quantity, unitPrice, totalPrice], (error, results) => {
        if (error) {
            console.error("Error inserting order product:", error);
            res.status(500).send("Failed to add order product");
        } else {
            res.redirect('/orderProducts'); // Redirect only on success
        }
    });
});

app.put('/orderProducts/:id', (req, res) => {
    const orderProductID = req.params.id;
    const { orderID, productID, quantity, unitPrice, totalPrice, orderDate } = req.body;  // Add orderDate to the destructured object

    // Ensure productID is a valid integer that exists in the Products table
    const queryUpdateOrderProduct = `
    UPDATE OrderProducts
    SET orderID = ?, productID = ?, quantity = ?, unitPrice = ?, totalPrice = ?, orderDate = ?
    WHERE orderProductID = ?;
    `;

    db.pool.query(queryUpdateOrderProduct, [orderID, productID, quantity, unitPrice, totalPrice, orderDate, orderProductID], (error, results) => {
        if (error) {
            console.error("Error updating product:", error);
            return res.status(500).send("Error updating product");
        }
        res.sendStatus(200);
    });
});




// DELETE /orderProducts/:id
app.delete('/orderProducts/:id', (req, res) => {
    const orderProductID = req.params.id;

    const queryDeleteOrderProduct = `
        DELETE FROM OrderProducts WHERE orderProductID = ?;
    `;

    db.pool.query(queryDeleteOrderProduct, [orderProductID], (error, results) => {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});

/*
    PRODUCT INSTANCES
*/

// GET /productInstances
app.get('/productInstances', (req, res) => {
    const queryProductInstances = `
        SELECT ProductInstances.instanceID, ProductInstances.orderID, ProductInstances.productID, ProductInstances.serialNumber, Products.productName, Orders.orderDate
        FROM ProductInstances
        LEFT JOIN Products ON ProductInstances.productID = Products.productID
        LEFT JOIN Orders ON ProductInstances.orderID = Orders.orderID;
    `;
    db.pool.query(queryProductInstances, (error, productInstancesRows) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
        } else {
            res.render('productInstances', {
                data: productInstancesRows
            });
        }
    });
});

// POST /productInstances
app.post('/productInstances', (req, res) => {
    const { orderID, productID, serialNumber } = req.body;

    const queryInsertProductInstance = `
        INSERT INTO ProductInstances (orderID, productID, serialNumber)
        VALUES (?, ?, ?);
    `;

    db.pool.query(queryInsertProductInstance, [orderID, productID, serialNumber], (error, results) => {
        if (error) {
            console.error(error);
            res.redirect('/productInstances');
        } else {
            res.redirect('/productInstances');
        }
    });
});

// PUT /productInstances/:id
app.put('/productInstances/:id', (req, res) => {
    const instanceID = req.params.id;
    const { orderID, productID, serialNumber } = req.body;

    const queryUpdateProductInstance = `
        UPDATE ProductInstances
        SET orderID = ?, productID = ?, serialNumber = ?
        WHERE instanceID = ?;
    `;

    db.pool.query(queryUpdateProductInstance, [orderID, productID, serialNumber, instanceID], (error, results) => {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});

// DELETE /productInstances/:id
app.delete('/productInstances/:id', (req, res) => {
    const instanceID = req.params.id;

    const queryDeleteProductInstance = `
        DELETE FROM ProductInstances WHERE instanceID = ?;
    `;

    db.pool.query(queryDeleteProductInstance, [instanceID], (error, results) => {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});

