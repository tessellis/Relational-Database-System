-- database/ddl.sql

SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they exist
DROP TABLE IF EXISTS ProductInstances;
DROP TABLE IF EXISTS OrderProducts;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Suppliers;
DROP TABLE IF EXISTS Brands;

-- Create Customers table
CREATE TABLE Customers (
    customerID INT AUTO_INCREMENT PRIMARY KEY,
    customerName VARCHAR(255) UNIQUE NOT NULL,
    customerEmail VARCHAR(255) UNIQUE NOT NULL,
    customerAddress VARCHAR(255),
    phoneNumber VARCHAR(20),
    username VARCHAR(50) UNIQUE NOT NULL
);

-- Create Suppliers table
CREATE TABLE Suppliers (
    supplierID INT AUTO_INCREMENT PRIMARY KEY,
    supplierName VARCHAR(255) NOT NULL UNIQUE,
    contactInfo VARCHAR(255),
    supplierAddress VARCHAR(255)
);

-- Create Brands table
CREATE TABLE Brands (
    brandID INT AUTO_INCREMENT PRIMARY KEY,
    brandName VARCHAR(255) NOT NULL UNIQUE,
    contactInfo VARCHAR(255),
    relationshipType VARCHAR(50)
);

-- Create Products table
CREATE TABLE Products (
    productID INT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    categoryName VARCHAR(255),
    stockQuantity INT DEFAULT 0,
    supplierID INT,
    brandID INT,
    FOREIGN KEY (supplierID) REFERENCES Suppliers(supplierID) ON DELETE SET NULL,
    FOREIGN KEY (brandID) REFERENCES Brands(brandID) ON DELETE SET NULL
);

-- Create Orders table
CREATE TABLE Orders (
    orderID INT AUTO_INCREMENT PRIMARY KEY,
    orderDate DATE NOT NULL,
    shippingDate DATE,
    status VARCHAR(50),
    totalAmount DECIMAL(10,2) NOT NULL,
    customerID INT,
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE SET NULL
);

-- Create OrderProducts table
CREATE TABLE OrderProducts (
    orderProductID INT AUTO_INCREMENT PRIMARY KEY,
    orderID INT,
    productID INT,
    quantity INT,
    unitPrice DECIMAL(10, 2),
    totalPrice DECIMAL(10, 2),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);


-- Create ProductInstances table
CREATE TABLE ProductInstances (
    instanceID INT AUTO_INCREMENT PRIMARY KEY,
    orderID INT,
    productID INT,
    serialNumber VARCHAR(255),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID) ON DELETE SET NULL,
    FOREIGN KEY (productID) REFERENCES Products(productID) ON DELETE SET NULL
);

SET FOREIGN_KEY_CHECKS = 1;