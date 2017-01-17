var express = require('express');
var router = express.Router();

// Require models
var Users = require('./models/user');

router.get('/', function(req, res) {
    res.json({ message: 'Hello World!' });
});

module.exports = router;
