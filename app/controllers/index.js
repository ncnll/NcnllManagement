var express = require('express');

/* GET home page. */
exports.index =function(req, res) {
    res.render('index', { title: 'ncnll' });
};


/* GET home page. */
exports.indexData = function(req, res) {
    var data = [];
    res.json(data);
};


/* GET home page. */
exports.userProducts = function(req, res) {
    var data = [];
    res.json(data);
};
