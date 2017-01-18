// server.js

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');

// used to create, sign, and verify tokens
var jwt = require('jsonwebtoken');

// Config files
var config = require('./config/config');

// DB Connect
mongoose.connect(config.mongooseUri, config.mongooseOptions);

// JWT
app.set('superSecret', config.secret);

// ROUTES
var router = require('./app/routes');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// START THE SERVER
app.listen(config.port);
console.log('Server on port: ' + config.port);
