const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require("cookie-parser");


const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(router)
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
dotenv.config();
app.use(cookieParser());


let whiteList = ['http://localhost:3000']

let corsOptions = {
    origin: whiteList,
    credentials: true,
    method: 'GET,POST,PUT,DELETE'
}

router.use(cors(corsOptions));

var dbConn = mysql.createConnection({
    host     : process.env.MYSQL_HOST,
    port     : process.env.MYSQL_PORT,
    user     : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE
});

dbConn.connect(function(err){
    if (err) throw err;
    console.log(`Connected DB: ${process.env.MYSQL_DATABASE}`);
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ storage: storage });

// Case success
// Testing login
// method: post
// URL: http://localhost:3030/login
// body: raw JSON
// {
//    "username" : "test",
//    "password" : "1234"
// }

// Case failure
// Testing login
// method: post
// URL: http://localhost:3030/login
// body: raw JSON
// {
//    "username" : "testdkf",
//    "password" : "1234"
// }

router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const recaptcha = req.body.recaptcha;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }
    /*คอมเม้นไว้เพราะว่าถ้ามี reCAPTCHA จะ test postman ไม่ได้ครับ*/    
    // if(!recaptcha){
    //     return res.status(400).json({ error: "Please complete the reCAPTCHA"});
    // }

    const secretKey = "6LddY4sqAAAAAI93R3cMtR8tyK04DTplhqFYFqiN";
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}`;
    
    try {
        /*คอมเม้นไว้เพราะว่าถ้ามี reCAPTCHA จะ test postman ไม่ได้ครับ*/   
        // const recaptchaResponse = await fetch(verificationURL, { method: "POST" });
        // const recaptchaResult = await recaptchaResponse.json();

        // if (!recaptchaResult.success) {
        //     return res.status(400).json({ error: "reCAPTCHA verification failed." });
        // }

        const sqlQuery = "SELECT * FROM admin WHERE username = ?";
        dbConn.query(sqlQuery, [username], (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "An error occurred while processing your request." });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: "Invalid username or password." });
            }

            const admin = results[0];

            if (password !== admin.password_hash) {
                return res.status(401).json({ error: "Invalid username or password." });
            }

            const loginQuery = "INSERT INTO admin_login (admin_id, username, password_hash) VALUES (?, ?, ?)";
            dbConn.query(loginQuery, [admin.admin_id, admin.username, admin.password_hash], (err) => {
            if (err) {
                console.error("Error inserting login data:", err);
                return res.status(500).json({ error: "Failed to record login." });
            }


            const sessionToken = `session-${new Date().getTime()}`;
            const cookieOptions = {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            };
            res.cookie("CookieNaJa", sessionToken, cookieOptions);
            res.status(200).json({ message: "Login successful", user: { username: admin.username } });
            });
        });
    } catch (err) {
        console.error("Error during reCAPTCHA verification:", err);
        return res.status(500).json({ error: "An error occurred while verifying reCAPTCHA." });
    }
});

// case success
// Testing Insert a new product 
// method: post
// URL: http://localhost:3030/product
// body: form-data
//     key                  value
// product_id       Text     7
// brand            Text    Puma
// name             Text    Jersey MIC
// price            Text    2500
// color            Text    Midnight Blue
// category         Text    jersey
// stock_quantity   Text    12
// Main_img         File   File (Optional)
// Det_img          File   File (Optional)
// Thumb1_img       File   File (Optional)
// Thumb2_img       File   File (Optional)
// Thumb3_img       File   File (Optional)

// case failure (Don't have name or price)
// Testing Insert a new product 
// method: post
// URL: http://localhost:3030/product
// body: form-data
//     key                  value
// product_id       Text     8
// brand            Text    Adidas
// color            Text    Black
// category         Text    shoes
// stock_quantity   Text    10
// Main_img         File   File (Optional)
// Det_img          File   File (Optional)
// Thumb1_img       File   File (Optional)
// Thumb2_img       File   File (Optional)
// Thumb3_img       File   File (Optional)

router.post('/product', 
    
    upload.fields([
        { name: 'Main_img', maxCount: 1 },
        { name: 'Det_img', maxCount: 1 },
        { name: 'thumb1', maxCount: 1 },
        { name: 'thumb2', maxCount: 1 },
        { name: 'thumb3', maxCount: 1 }
    ])
    ,function (req, res) {
    let product = req.body;
    console.log(product);

    product.Main_Image = `/${req.files['Main_img']?.[0]?.filename}` || null;
    product.Det_Image = `/${req.files['Det_img']?.[0]?.filename}` || null;
    product.Th1_Image = `/${req.files['thumb1']?.[0]?.filename}` || null;
    product.Th2_Image = `/${req.files['thumb2']?.[0]?.filename}` || null;
    product.Th3_Image = `/${req.files['thumb3']?.[0]?.filename}` || null;

    if (!product || !product.name || !product.price) {
        return res.status(400).send({ error: true, message: 'Please provide complete product information' });
    }
    
    dbConn.query("INSERT INTO Product SET ? ", product, function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results.insertId, message: 'New product has been created successfully.' });
    });
});

// case success (edit price from 2500 to 5000)
// Testing Update a product 
// method: put
// URL: http://localhost:3030/product
// body: form-data
//     key                  value
// product_id       Text     7
// brand            Text    Puma
// name             Text    Jersey MIC
// price            Text    5000
// color            Text    Midnight Blue
// category         Text    jersey
// stock_quantity   Text    12
// Main_img         File   File (Optional)
// Det_img          File   File (Optional)
// Thumb1_img       File   File (Optional)
// Thumb2_img       File   File (Optional)
// Thumb3_img       File   File (Optional)

// case failure (Don't have product id)
// Testing Update a product 
// method: put
// URL: http://localhost:3030/product
// body: form-data
//     key                  value
// brand            Text    Puma
// name             Text    Jersey MIC
// price            Text    5000
// color            Text    Midnight Blue
// category         Text    jersey
// stock_quantity   Text    12
// Main_img         File   File (Optional)
// Det_img          File   File (Optional)
// Thumb1_img       File   File (Optional)
// Thumb2_img       File   File (Optional)
// Thumb3_img       File   File (Optional)

router.put('/product', 
    upload.fields([
        { name: 'Main_img', maxCount: 1 },
        { name: 'Det_img', maxCount: 1 },
        { name: 'thumb1', maxCount: 1 },
        { name: 'thumb2', maxCount: 1 },
        { name: 'thumb3', maxCount: 1 }
    ])
    ,function (req, res) {
        const productID = req.body.product_id;
        if (!productID) {
            return res.status(400).send({ error: true, message: 'Product ID is required' });
        }

        const product = { ...req.body };

        if (req.files['Main_img']) product.Main_Image = `/uploads/${req.files['Main_img'][0].filename}`;
        if (req.files['Det_img']) product.Det_Image = `/uploads/${req.files['Det_img'][0].filename}`;
        if (req.files['thumb1']) product.Th1_Image = `/uploads/${req.files['thumb1'][0].filename}`;
        if (req.files['thumb2']) product.Th2_Image = `/uploads/${req.files['thumb2'][0].filename}`;
        if (req.files['thumb3']) product.Th3_Image = `/uploads/${req.files['thumb3'][0].filename}`;

        Object.keys(product).forEach(key => {
            if (!product[key]) delete product[key];
        });
    
    dbConn.query("UPDATE Product SET ? WHERE product_id = ?", [product, productID], function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'Product has been updated successfully.' });
    });
});

// case success 
// Testing Delete a product 
// method: delete
// URL: http://localhost:3030/product/7
// type: parameters

// case failure (Don't have parameters)
// Testing Delete a product 
// method: delete
// URL: http://localhost:3030/product
// type: parameters


router.delete('/product/:id', function (req, res) {
    let product_id = req.params.id;
    if (!product_id) {
        return res.status(400).send({ error: true, message: 'Please provide product ID' });
    }

    const sqlSelect = 'SELECT Main_Image, Det_Image, Th1_Image, Th2_Image, Th3_Image FROM Product WHERE product_id = ?';
    dbConn.query(sqlSelect, [product_id], function (error, results) {
        if (error) {
            console.error('Database Error:', error);
            return res.status(500).send({ error: true, message: 'Database error occurred while retrieving product images' });
        }

        if (results.length === 0) {
            return res.status(404).send({ error: true, message: 'Product not found' });
        }

        const productImages = results[0];

        const deleteFile = (filePath) => {
            if (filePath) {
                const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, '../', filePath);
                fs.unlink(absolutePath, (err) => {
                    if (err && err.code !== 'ENOENT') {
                        console.error(`Error deleting file: ${absolutePath}`, err);
                    } else {
                        console.log(`Deleted file: ${absolutePath}`);
                    }
                });
            }
        };
        deleteFile(path.join(__dirname, '../uploads', productImages.Main_Image));
        deleteFile(path.join(__dirname, '../uploads', productImages.Det_Image));
        deleteFile(path.join(__dirname, '../uploads', productImages.Th1_Image));
        deleteFile(path.join(__dirname, '../uploads', productImages.Th2_Image));
        deleteFile(path.join(__dirname, '../uploads', productImages.Th3_Image));
    
    dbConn.query('DELETE FROM Product WHERE product_id = ?', [product_id], function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'Product has been deleted successfully.' });
    });
});
});

// case success 
// Testing Get a product 
// method: get
// URL: http://localhost:3030/product/1
// type: parameters

// case success 
// Testing Get a product 
// method: get
// URL: http://localhost:3030/product/2
// type: parameters

// case failure (Don't have parameters)
// Testing Get a product 
// method: get
// URL: http://localhost:3030/product
// type: parameters

router.get('/product/:id', function (req, res) {
    let product_id = req.params.id;

    if (!product_id) {
        return res.status(400).send({ error: true, message: 'Please provide product ID.' });
    }
    
    dbConn.query('SELECT * FROM Product WHERE product_id = ?', product_id, function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Product retrieved successfully.' });
    });    
});

// case success 
// Testing Get products
// method: get (get all)
// URL: http://localhost:3030/products

// case failure (Wrong URL)
// Testing Get products
// method: get (get all)
// URL: http://localhost:3030/product


router.get('/products', function (req, res) {
    dbConn.query('SELECT * FROM Product', function (error, results) {
        if (error) throw error;
        results.forEach(product => {
            if (product.Main_Image) product.Main_Image = `${product.Main_Image}`;
            if (product.Det_Image) product.Det_Image = `${product.Det_Image}`;
            if (product.Th1_Image) product.Th1_Image = `${product.Th1_Image}`;
            if (product.Th2_Image) product.Th2_Image = `${product.Th2_Image}`;
            if (product.Th3_Image) product.Th3_Image = `${product.Th3_Image}`;
        });
        return res.send({ error: false, data: results, message: 'Product list retrieved successfully.' });
    });
});

// Admin API

// case success
// Testing Insert a new admin account
// method: post
// URL: http://localhost:3030/admin
// body: raw JSON
// {
//     "first_name" : "Lionel",
//     "last_name" : "Messi",
//     "address" : "ICT",
//     "email" : "ictxdst@gmail.com",
//     "username" : "ICT",
//     "password_hash" : "DST"
// }

// case failure (Don't have an email)
// Testing Insert a new admin account
// method: post
// URL: http://localhost:3030/admin
// body: raw JSON
// {
//     "first_name" : "Kris",
//     "last_name" : "Arnold",
//     "address" : "Bangkok",
//     "username" : "HI",
//     "password_hash" : "Hello"
// }

router.post('/admin', function (req, res) {
    let admin = req.body;

    if (!admin || !admin.first_name || !admin.last_name || !admin.email) {
        return res.status(400).send({ error: true, message: 'Please provide complete admin information' });
    }
    
    const query = "INSERT INTO admin (first_name, last_name,address,email,username, password_hash) VALUES (?, ?, ?, ?, ?, ?)";
    dbConn.query(query,[admin.first_name,admin.last_name,admin.address,admin.email,admin.username,admin.password_hash] , function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results.insertId, message: 'New admin has been created successfully.' });
    });
});

// case success
// Testing Update a admin account
// method: put
// URL: http://localhost:3030/admin
// body: raw JSON
// {
//     "admin_id" : 3,
//     "first_name" : "Lionel",
//     "last_name" : "de rer Messi",
//     "address" : "ICT",
//     "email" : "ictxdst@gmail.com",
//     "username" : "ICT12",
//     "password_hash" : "DST123"
// }

// case failure (Don't have an admin id)
// Testing Update a admin account
// method: put
// URL: http://localhost:3030/admin
// body: raw JSON
// {
//     "first_name" : "Lionel",
//     "last_name" : "de rer Messi",
//     "address" : "ICT",
//     "email" : "ictxdst@gmail.com",
//     "username" : "ICT12",
//     "password_hash" : "DST123"
// }

router.put('/admin', function (req, res) {
    let adminID = req.body.admin_id;
    let admin = req.body;
    if (!adminID || !admin) {
        return res.status(400).send({ error: true, message: 'Please provide admin information and admin ID' });
    }
    
    dbConn.query("UPDATE admin SET ? WHERE admin_id = ?", [admin, adminID], function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'Admin has been updated successfully.' });
    });
});

// case success 
// Testing Delete a admin account
// method: delete
// URL: http://localhost:3030/admin/3
// type: parameters

// case failure (Don't have parameters)
// Testing Delete a admin account
// method: delete
// URL: http://localhost:3030/admin
// type: parameters

router.delete('/admin/:id', function (req, res) {
    let adminID = req.params.id;
    if (!adminID) {
        return res.status(400).send({ error: true, message: 'Please provide admin ID' });
    }
    
    dbConn.query('DELETE FROM admin WHERE admin_id = ?', [adminID], function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'admin has been deleted successfully.' });
    });
});

// case success 
// Testing get a admin account
// method: get
// URL: http://localhost:3030/admin/1
// type: parameters

// case failure (Don't have parameters)
// Testing get a admin account
// method: get
// URL: http://localhost:3030/admin
// type: parameters


router.get('/admin/:id', function (req, res) {
    let admin_id = req.params.id;

    if (!admin_id) {
        return res.status(400).send({ error: true, message: 'Please provide admin ID.' });
    }
    
    dbConn.query('SELECT * FROM admin WHERE admin_id = ?', admin_id, function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'admin retrieved successfully.' });
    });    
});

// case success 
// Testing get admin accounts
// method: get (get all)
// URL: http://localhost:3030/admins
// type: parameters

router.get('/admins', function (req, res) {
    dbConn.query('SELECT * FROM admin', function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'admin list retrieved successfully.' });
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port: ${process.env.PORT}`)
    });