// server.js

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

// Config files
var config = require('./config/config');

// DB Connect
mongoose.connect(config.mongooseUri, config.mongooseOptions);

// JWT
app.set('superSecret', config.secret);

// ROUTES
var router = require('./app/routes')(express, app, jwt);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// START THE SERVER
app.listen(config.port);
console.log('Server on port: ' + config.port);
