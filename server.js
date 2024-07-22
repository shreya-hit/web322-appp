/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _____Shreya Adhikari_________________ Student ID: ___155466220___________ Date: ___July 21, 2024_____________
* 
*  GitHub Repository URL: https://github.com/shreya-hit/web322-app.git
*
********************************************************************************/ 
const express = require('express');
const app = express();
const path = require('path');
const storeService = require('./store-service');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: 'shreya cloud',
    api_key: '173412883962461',
    api_secret: 'sJnD7AP-sXJdBTrkmU1yPtZMHYg',
    secure: true
});

const upload = multer(); // no { storage: storage } since we are not using disk storage

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/shop', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Shop</title>
            <link rel="stylesheet" href="/css/bootstrap.css"> 
            <link rel="stylesheet" href="/css/main.css"> 
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">WEB322 – Assignment 4 - Shreya Adhikari</a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active" href="/shop">Shop</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/about">About</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/items">Items</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/items/add">Add Item</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/categories">Categories</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div class="container mt-5">
                <div class="row">
                    <div class="col-md-12">
                        <h2>Shop</h2>
                        <div id="shop-container"></div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>&copy; Shreya Adhikari. All rights reserved.</p>
            </div>
            <script src="/js/main.js"></script>
        </body>
        </html>
    `);
});

app.get('/categories', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Categories</title>
            <link rel="stylesheet" href="/css/bootstrap.css"> 
            <link rel="stylesheet" href="/css/main.css"> 
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">WEB322 – Assignment 4 - Shreya Adhikari</a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/shop">Shop</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/about">About</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/items">Items</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/items/add">Add Item</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="/categories">Categories</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div class="container mt-5">
                <div class="row">
                    <div class="col-md-12">
                        <h2>Categories</h2>
                        <div id="categories-container"></div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>&copy; Shreya Adhikari. All rights reserved.</p>
            </div>
            <script src="/js/main.js"></script>
        </body>
        </html>
    `);
});

app.get('/items', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Items</title>
            <link rel="stylesheet" href="/css/bootstrap.css"> 
            <link rel="stylesheet" href="/css/main.css"> 
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">WEB322 – Assignment 4 - Shreya Adhikari</a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/shop">Shop</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/about">About</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="/items">Items</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/items/add">Add Item</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/categories">Categories</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div class="container mt-5">
                <div class="row">
                    <div class="col-md-12">
                        <h2>Items</h2>
                        <div id="items-container"></div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>&copy; All rights reserved.</p>
            </div>
            <script src="/js/main.js"></script>
        </body>
        </html>
    `);
});

app.get('/shop-data', (req, res) => {
    storeService.getPublishedItems()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ message: err }));
});

app.get('/items-data', (req, res) => {
    if (req.query.category) {
        storeService.getItemsByCategory(req.query.category)
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ message: err }));
    } else if (req.query.minDate) {
        storeService.getItemsByMinDate(req.query.minDate)
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ message: err }));
    } else {
        storeService.getAllItems()
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ message: err }));
    }
});

app.get('/items/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addItem.html'));
});

app.get('/categories-data', (req, res) => {
    storeService.getCategories()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ message: err }));
});

app.post('/items/add', upload.single("featureImage"), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }

        upload(req).then((uploaded) => {
            processItem(uploaded.url);
        });
    } else if (req.body.imageUrl) {
        processItem(req.body.imageUrl);
    } else {
        processItem("");
    }

    function processItem(imageUrl) {
        req.body.featureImage = imageUrl;

        storeService.addItem(req.body).then(() => {
            res.redirect('/items');
        }).catch(err => {
            res.status(500).send("Unable to add item");
        });
    }
});

app.get('/item/:id', (req, res) => {
    storeService.getItemById(req.params.id)
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ message: err }));
});

// Catch-all route for unmatched paths
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

const PORT = process.env.PORT || 8080;

storeService.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Express http server listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error(`Unable to start server: ${err}`);
    });