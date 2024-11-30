Create database if not exists ShoeStore;
use ShoeStore; 

CREATE TABLE Product (
    product_id INT PRIMARY KEY,
    brand VARCHAR(100),
    Name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    color VARCHAR(100),
    category VARCHAR(100),
    stock_quantity INT,
    Main_Image VARCHAR(255),
    Det_Image VARCHAR(255),
    Th1_Image VARCHAR(255),
    Th2_Image VARCHAR(255),
    Th3_Image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Admin (
    admin_id INT auto_increment PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL ,
    username VARCHAR(100) NOT NULL ,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_login (
	admin_id INT ,
    id_log INT auto_increment,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT PK_adlog primary key (id_log),
    CONSTRAINT FK_adlog foreign key (admin_id) references Admin(admin_id)
);

CREATE TABLE Customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    DOB date,
    Gender varchar(10),
    Username VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Initiative
INSERT INTO Product
VALUES
(1, 'Adidas', 'Predator League Firm Ground', 7500.00, 'Luminous Blue', 'shoes', 20, '/1732605230268-Adidas1.png', '/1732605230275-predator-main.avif', '/1732605230275-predator-thumb1.avif', '/1732605230275-predator-thumb2.avif', '/1732605230276-predator-thumb3.avif', '2024-11-26 14:13:50', '2024-11-26 14:36:39'),
(2, 'Adidas', 'Predator Club Flexible', 5400.00, 'Cloud White', 'shoes', 15, '/1732605518468-Adidas2.png', '/1732605518472-det-predatorclub.avif', '/1732605518472-thumb1-predtorclub.avif', '/1732605518473-thumb2-preclub.avif', '/1732605518473-thumb3-preclub.avif', '2024-11-26 14:18:38', '2024-11-26 14:36:43'),
(3, 'Adidas', 'F50 League Firm', 4500.00, 'Aurora Black', 'shoes', 10, '/1732605789236-Adidas3.png', '/1732605789243-det-f50l.avif', '/1732605789243-thumb1-f50l.avif', '/1732605789244-thumb2-f50l.avif', '/1732605789244-thumb3-f50l.avif', '2024-11-26 14:23:09', '2024-11-26 14:36:46'),
(4, 'Adidas', 'Copa Pure 2 League', 3000.00, 'Platinum Metalic', 'shoes', 15, '/1732606673349-Adidas4.png', '/1732606673353-det-copa.avif', '/1732606673353-thumb1-copa.avif', '/1732606673353-thumb2-copa.avif', '/1732606673354-thumb3-copa.avif', '2024-11-26 14:37:53', '2024-11-26 14:37:53'),
(5, 'Nike', 'Paris Saint-Germain 2023/24', 3500.00, 'Midnight Navy', 'jersey', 20, '/1732618531998-main-PSG.jpg', '/1732618532003-det-psg.png', '/1732618532005-thumb1-psg.png', '/1732618532007-thumb2-psg.jpg', '/1732618532012-thumb3-psg.jpg', '2024-11-26 17:55:32', '2024-11-26 17:55:32'),
(6, 'Nike', 'Nike Club Team', 1500.00, 'Black / White', 'accessorie', 5, '/1732619120322-main-ballbag.jpg', '/1732619120326-det-ballbag.jpg', '/1732619120329-thumb1-ballbag.jpg', '/1732619120333-thumb2-ballbag.jpg', '/1732619120335-thumb3-ballbag.png', '2024-11-26 18:05:20', '2024-11-26 18:05:20');

-- Admins Initiative
INSERT INTO Users (id, FirstName, LastName, Address, Email, Username, Password, Created_At)
VALUES
(1, 'Sapon', 'Wongkrasaemongkol', 'nonsi20', 'Sapon2548@gmail.com', 'test', '1234', '2024-11-28 11:49:19'),
(2, 'Saponfds', 'eiei', 'dafdsfds', 'Adam.sm@gmail.com', 'test1', '123345', '2024-11-29 19:40:53');



