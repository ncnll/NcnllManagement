var express = require('express');
var fs = require('fs');

/* GET home page. */
exports.index =function(req, res) {
    res.render('index', { title: 'ncnll' });
};


/* */
exports.indexData = function(req, res) {
    var data = [];
    res.json(data);
};


/* */
exports.userProducts = function(req, res) {
    var data = [];
    res.json(data);
};


/**File upload**/
exports.uploadCommonFile = function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files
    console.log(req.files.length)
    if(req.files && req.files.file){
    	res.json(req.files);
    	/*fs.rename(req.files.file.path, "./public/uploadimages/"+req.files.file.name, function(err){
    		if(err){
    			res.json(err);
    		}else{
    			res.json(req.files);
    		}
    	});*/
    }else{
    	res.json({msg:"没有文件"});
    }
    	
};
