const express    = require('express');
const morgan     = require('morgan');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');

const productsRoutes    = require('./api/routes/products');
const orderRoutes       = require('./api/routes/orders');
const userRoutes        = require('./api/routes/user');

// Database configuration defined on MongoDB Atlas account
mongoose.connect('mongodb://<user>:' + process.env.MONGO_ATLAS_PW + '<url provided by MongoDB Atlas>');

const app = express();

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTION') {
        res.header('Acces-Control-Allow-Methods', 'PUT, POST, DELETE, PATH, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/products', productsRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// Handling errors
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status= 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;