var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

const authCMSRouter = require('./app/api/v1/auth/router');
const usersRouter = require('./app/api/v1/users/router'); 
const categoriesRouter = require('./app/api/v1/categories/router');
const productsRouter = require('./app/api/v1/products/router');
const paymentsRouter = require('./app/api/v1/payments/router');
const customersRouter = require('./app/api/v1/customers/router');

// middlewares
const notFoundMiddleware = require('./app/middlewares/not-found');
const handleErrorMiddleware = require('./app/middlewares/handler-error');

const v1 = '/api/v1';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'welcome to api shopped-online',
    });
});

app.use(v1, authCMSRouter);
app.use(v1, usersRouter);
app.use(v1, categoriesRouter);
app.use(v1, productsRouter);
app.use(v1, paymentsRouter);
app.use(v1, customersRouter);

// middlewares
app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

module.exports = app;
