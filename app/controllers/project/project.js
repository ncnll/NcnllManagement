var mongoose = require('mongoose')
  , CommonModel = mongoose.model('Project')
  , utils = require('../../../lib/utils')
  , passport = require('passport');
  var Promise = require('bluebird');
  Promise.promisifyAll(CommonModel);
  Promise.promisifyAll(CommonModel.prototype);

exports.toSearchList = function(req, res){
  res.render("project/project",{object_name:"生产项目"});
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
/*    console.log(commonModel)

    commonModel.startTime = new Date(commonModel.startTime.valueOf()+commonModel.startTime.getTimezoneOffset() * 60000);
    commonModel.preEndTime = new Date(commonModel.preEndTime.valueOf()+commonModel.preEndTime.getTimezoneOffset() * 60000);
    commonModel.endTime = new Date(commonModel.endTime.valueOf()+commonModel.endTime.getTimezoneOffset() * 60000);
        console.log(commonModel)*/
    commonModel.save(function(err) {
        utils.setSaveResponse(err, res, commonModel);
    });
};

exports.remove = function(req, res){
  var id = req.param("_id");
  CommonModel.findOneAndRemove(id, function(err, doc){
    utils.setSaveResponse(err, res, doc);
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
    
   /* req.body.startTime=new Date(req.body.startTime);
    req.body.preEndTime=new Date(req.body.preEndTime);
    req.body.endTime=new Date(req.body.endTime);
    req.body.startTime = new Date(req.body.startTime.valueOf()-req.body.startTime.getTimezoneOffset() * 60000);
    req.body.preEndTime = new Date(req.body.preEndTime.valueOf()-req.body.preEndTime.getTimezoneOffset() * 60000);
    req.body.endTime = new Date(req.body.endTime.valueOf()-req.body.endTime.getTimezoneOffset() * 60000);*/
    CommonModel.findOneAndUpdate({ _id:req.body._id},req.body, function (err, obj) {
      utils.setSaveResponse(err, res, obj);
    });

};

//更新轮播图片
exports.updateCameras = function(req, res){
  //var scrollImages = req
  CommonModel.findOneAsync({ _id:req.body.projectId}).then(function(projectInfo) {
    if(projectInfo){
      return projectInfo;
    }else{
      return Promise.reject(new Error());
    }
  }).then(function(projectInfo){
    var cameras = eval('('+req.body.cameras+')');
    return CommonModel.updateAsync({_id:req.body.projectId}, {cameraViews:cameras}, {multi:true});
  }).then(function(raw){
    utils.setSaveResponse(undefined, res, raw);
  }).catch(function(e){
    //e?1:e=new Error("未知错误");
    utils.setSaveResponse(e, res, undefined);
  });
  
}