var mongoose = require('mongoose')
  , CommonModel = mongoose.model('ProductInfo')
  , utils = require('../../../lib/utils')
  , passport = require('passport');
var Promise = require('bluebird');
Promise.promisifyAll(CommonModel);
Promise.promisifyAll(CommonModel.prototype);

exports.toSearchList = function(req, res){
  res.render("front/productInfo",{object_name:"产品信息"});
};

exports.searchList = function(req, res) {
  var crite = utils.setCriteriaParam(req.body);
  var sortObj = utils.setSortParam(req.body);
  CommonModel.count(crite, function(errors, count){
    if(errors){
      res.json({
         "success":false,
         "msg":"查询过程中出错！",
         "error":errors
      });
      return;
    }
    CommonModel.queryList({rows:req.body.rows, page:req.body.page, criteria:crite, sort:sortObj}, function(err,list){
      utils.setQueryListResponse(err, req, res, list, count);
    });
  });
};

exports.add = function (req, res) {
    delete req.body._id;
    var commonModel = new CommonModel(req.body);
    commonModel.save(function(err) {
        utils.setSaveResponse(err, res, commonModel);
    });
};

exports.remove = function(req, res){
  var id = req.param("_id");
  CommonModel.findOneAndRemove(id, function(err, doc){
    utils.setDeleteResponse(err, res, doc);
  });
};

exports.updateById = function(req, res){
    if(!req.body._id){
       res.json({
                    "success":false,
                    "msg":"主键_id不能为空"
                });
      return;
    }
    CommonModel.findOneAndUpdate({ _id:req.body._id},req.body, function (err, obj) {
      utils.setSaveResponse(err, res, obj);
    });

};

//更新轮播图片
exports.updateScrollImage = function(req, res){
  //var scrollImages = req
  CommonModel.findOneAsync({ _id:req.body.productInfoId}).then(function(productInfo) {
    if(productInfo){
      return productInfo;
    }else{
      return Promise.reject(new Error());
    }
  }).then(function(productInfo){
    var scrollPics = eval('('+req.body.scrollImages+')');
    return CommonModel.updateAsync({_id:req.body.productInfoId}, {scrollPics:scrollPics}, {multi:true});
  }).then(function(raw){
    utils.setSaveResponse(undefined, res, raw);
  }).catch(function(e){
    //e?1:e=new Error("未知错误");
    utils.setSaveResponse(e, res, undefined);
  });
  
}

//更新视频tab
exports.updateVideoShow = function(req, res){
  //var scrollImages = req
  CommonModel.findOneAsync({ _id:req.body.productInfoId}).then(function(productInfo) {
    if(productInfo){
      return productInfo;
    }else{
      return Promise.reject(new Error());
    }
  }).then(function(productInfo){
    var timelapseVideos = eval('('+req.body.timelapseVideos+')');
    return CommonModel.updateAsync({_id:req.body.productInfoId}, {timelapseVideos:timelapseVideos}, {multi:true});
  }).then(function(raw){
    utils.setSaveResponse(undefined, res, raw);
  }).catch(function(e){
    //e?1:e=new Error("未知错误");
    utils.setSaveResponse(e, res, undefined);
  });
  
}


//更新视频tab
exports.updateHistoryCamera = function(req, res){
  //var scrollImages = req
  CommonModel.findOneAsync({ _id:req.body.productInfoId}).then(function(productInfo) {
    if(productInfo){
      return productInfo;
    }else{
      return Promise.reject(new Error());
    }
  }).then(function(productInfo){
    var realtimePics = eval('('+req.body.realtimePics+')');
    return CommonModel.updateAsync({_id:req.body.productInfoId}, {realtimePics:realtimePics}, {multi:true});
  }).then(function(raw){
    utils.setSaveResponse(undefined, res, raw);
  }).catch(function(e){
    //e?1:e=new Error("未知错误");
    utils.setSaveResponse(e, res, undefined);
  });
  
}