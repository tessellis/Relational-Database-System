-- database/dml.sql

SET FOREIGN_KEY_CHECKS = 0;

-- Insert sample data into Customers
INSERT INTO Customers (customerName, customerEmail, customerAddress, phoneNumber, username)
VALUES
  ('John Doe', 'johndoe@example.com', '123 Maple St', '123-456-7890', 'johndoe'),
  ('Jane Smith', 'janesmith@example.com', '456 Oak St', '234-567-8901', 'janesmith'),
  ('Bob Brown', 'bobbrown@example.com', '789 Pine St', '345-678-9012', 'bobbrown');

-- Insert sample data into Suppliers
INSERT INTO Suppliers (supplierName, contactInfo, supplierAddress)
VALUES
  ('Outdoor Gear Suppliers Inc.', 'info@ogs.com', '111 Cedar Ave'),
  ('Adventure Equipment Co.', 'contact@aec.com', '222 Birch Blvd'),
  ('Mountain Sports Supply', 'contact@mss.com', '333 Aspen Rd');

-- Insert sample data into Brands
INSERT INTO Brands (brandName, contactInfo, relationshipType)
VALUES
  ('North Face', 'contact@northface.com', 'exclusive'),
  ('Patagonia', 'contact@patagonia.com', 'preferred'),
  ('Columbia', 'contact@columbia.com', 'exclusive');

-- Insert sample data into Products
INSERT INTO Products (productName, description, price, categoryName, stockQuantity, supplierID, brandID)
VALUES
  ('Hiking Backpack', 'Durable hiking backpack', 99.99, 'Outdoor Gear', 50, 1, 1),
  ('Sleeping Bag', 'Warm and lightweight', 59.99, 'Womens Gear', 30, 2, 2),
  ('Climbing Rope', 'Strong climbing rope', 79.99, 'Mens Gear', 20, 3, 3);

-- Insert sample data into Orders
INSERT INTO Orders (orderDate, shippingDate, status, totalAmount, customerID)
VALUES
  ('2024-10-01', '2024-10-05', 'Shipped', 159.98, 1),
  ('2024-10-03', '2024-10-07', 'Delivered', 99.99, 2),
  ('2024-10-04', '2024-10-09', 'Pending', 79.99, 3);

INSERT INTO OrderProducts (orderID, productID, quantity, unitPrice, totalPrice)
VALUES 
    (1, 1, 1, 99.99, 99.99),
    (2, 2, 1, 59.99, 59.99),
    (3, 3, 1, 79.99, 79.99);

-- Insert sample data into ProductInstances
INSERT INTO ProductInstances (orderID, productID, serialNumber)
VALUES
  (1, 1, 'SN123456'),
  (2, 2, 'SN789012'),
  (3, 3, 'SN345678');

  SET FOREIGN_KEY_CHECKS = 1;