var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var ProductItemModel = mongoose.model('ProductItem');
var ProjectModel = mongoose.model('Project');
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
    if(req.files && req.files.file){
        if(req.body.productItemId){
            var proItemImage = {};
            proItemImage['historyImages.'+req.body.index+'.picIds']={
                "picId" : "13241234",
                "createTime" : new Date(),
                "description" : "Nice job"
            };
            ProductItemModel.update({ _id: req.body.productItemId},{ $push: proItemImage },{upsert: true},function(err,result){
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
            var projectImage = {};
            projectImage['historyImages.'+req.body.index+'.picIds']={
                "picId" : "13241234",
                "createTime" : new Date(),
                "description" : "Nice job"
            };
            ProjectModel.update({ _id: req.body.projectId},{ $push: projectImage },{upsert: true},function(err,result){
                if(err){
                    res.json({
                        success:false,
                        msg:"没有文件",
                        error:err
                    }); 
                }else{
                    res.json({
                        "file":req.files,
                        "result":result
                    });
                }
            });
        }
        


        //Get project id, image index; or Get projectItem id, image Index; Store.
        //Get cameraId--Get related projectid or projectItemId, Store 
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