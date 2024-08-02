/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _____Shreya Adhikari_________________ Student ID: ___155466220___________ Date: ___July 28, 2024_____________
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
const exphbs = require('express-handlebars');
const stripJs = require('strip-js');

cloudinary.config({
    cloud_name: 'shreya cloud',
    api_key: '173412883962461',
    api_secret: 'sJnD7AP-sXJdBTrkmU1yPtZMHYg',
    secure: true
});

const hbs = exphbs.create({
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li class="nav-item' +
                ((url == app.locals.activeRoute) ? ' active' : '') + '"><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        safeHTML: function(context){
            return stripJs(context);
        }
    }
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views')); //ensuring views directory is set

const upload = multer(); // no { storage: storage } since we are not using disk storage

app.use(express.static('public'));

app.use(function(req, res, next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});

app.get('/', (req, res) => {
    res.redirect('/shop');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/shop', (req, res) => {
    let viewData = {};

    storeService.getPublishedItems()
        .then(items => {
            viewData.items = items;
        }).catch(err => {
            viewData.message = "no results";
        }).then(storeService.getCategories)
        .then(categories => {
            viewData.categories = categories;
        }).catch(err => {
            viewData.categoriesMessage = "no results";
        }).then(() => {
            res.render('shop', { data: viewData });
        });
});

app.get('/shop/:id', (req, res) => {
    let viewData = {};

    storeService.getItemById(req.params.id).then(item => {
        viewData.item = item;
    }).catch(err => {
        viewData.message = "no results";
    }).then(storeService.getPublishedItems)
    .then(items => {
        viewData.items = items;
    }).catch(err => {
        viewData.message = "no results";
    }).then(storeService.getCategories)
    .then(categories => {
        viewData.categories = categories;
    }).catch(err => {
        viewData.categoriesMessage = "no results";
    }).then(() => {
        res.render('shop', { data: viewData });
    });
});

app.get('/items', (req, res) => {
    if (req.query.category) {
        storeService.getItemsByCategory(req.query.category)
            .then(data => res.render('items', { items: data }))
            .catch(err => res.render('items', { message: "no results" }));
    } else if (req.query.minDate) {
        storeService.getItemsByMinDate(req.query.minDate)
            .then(data => res.render('items', { items: data }))
            .catch(err => res.render('items', { message: "no results" }));
    } else {
        storeService.getAllItems()
            .then(data => res.render('items', { items: data }))
            .catch(err => res.render('items', { message: "no results" }));
    }
});

app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then(data => res.render('categories', { categories: data }))
        .catch(err => res.render('categories', { message: "no results" }));
});

app.get('/items/add', (req, res) => {
    res.render('addItem');
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

    function processItem(imageUrl) 
    {
        req.body.featureImage = imageUrl;
        req.body.itemDate = new Date().toISOString().split('T')[0];

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

app.use((req, res) => {
    res.status(404).render('404');
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