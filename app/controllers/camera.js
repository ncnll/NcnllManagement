var mongoose = require('mongoose')
  , CameraModel = mongoose.model('Camera')
  , utils = require('../../lib/utils')
  , passport = require('passport');

exports.toSearchList = function(req, res){
  res.render("device/camera/camera",{object_name:"设备相机"});
};

// Handle cross-domain requests
exports.searchList = function(req, res) {

  var crite = utils.setCriteriaParam(req.body);
  var sortObj = utils.setSortParam(req.body);
  CameraModel.count({ serialNumber:  '66'  }, function(errors, count){
    if(errors){
      res.json({
         "success":false,
         "msg":"查询过程中出ddd错！",
         "error":errors
      });
      return;
    }
    CameraModel.queryList({rows:req.body.rows, page:req.body.page, criteria:crite, sort:sortObj}, function(err,list){
      utils.setQueryListResponse(err, req, res, list, count);
    });
  });
};

exports.add = function (req, res) {
    delete req.body._id;
    var camera = new CameraModel(req.body);
    camera.save(function(err) {
      console.log(err)
        utils.setSaveResponse(err, res, camera);
    });
};

exports.remove = function(req, res){
  var id = req.param("_id");
  CameraModel.findOneAndRemove(id, function(err, doc){
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
    CameraModel.findOneAndUpdate({ _id:req.body._id},req.body, function (err, obj) {
      utils.setSaveResponse(err, res, obj);
    });

};

