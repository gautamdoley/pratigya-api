const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



mongoose.connect('mongodb+srv://gautam:gautam@gautam-bdezj.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true})
    .then(result => {
        console.log("Mongdb connected...");
    }).catch(err => console.log(err));


//for medicine routes
const medicineRoutes = require('./api/routes/medicines/medicines');

//for user routes
const userRoutes = require('./api/routes/users/users');
//category routes
const categoryRoutes = require('./api/routes/categories/categories');
//Supplier routes
const supplierRoutes = require('./api/routes/suppliers/suppliers');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json());



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization,x-access-token');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


//routes which should be handle requests
app.use('/medicines', medicineRoutes);

app.use('/users', userRoutes);

app.use('/categories', categoryRoutes);

app.use('/suppliers',supplierRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
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