var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var ImageInfoModel = mongoose.model('ImageInfo');
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
    	res.json({
            success:false,
            msg:"没有文件"
        });
    }
    	
};


/**Camera File upload**/
exports.uploadCameraPhoto = function(req, res){

    console.log(req.body)

    if(req.files && req.files.file && /^[0-9]*$/.test(req.body.index)){
         
         var imageInfo = new ImageInfoModel(req.body);
         imageInfo.uploadTime=new Date();
         imageInfo.save(function(err,result){
            if(err){
                res.json({
                    success:false,
                    msg:"没有文件",
                    error:err
                }); 
            }else{
                res.json({
                    "file":req.files,
                    "productItem":result
                });
            }
         });
               
        
    }else{
        res.json({
            success:false,
            msg:"没有文件或参数错误!"
        });
    }
        
};