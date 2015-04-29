var mongoose = require('mongoose')
  , CameraModel = mongoose.model('Camera')
  , utils = require('../../lib/utils')
  , passport = require('passport');

// Handle cross-domain requests
exports.searchList = function(req, res) {
  var rows = req.param("rows");
  var page = req.param("page");
  var camera = new CameraModel(req.body);
  var ct;
  //查询条件
  /*var crite = { };
  if(req.body.code){
      crite.code={ $eq: req.body.code };
  }*/
  var crite = utils.setCriteriaParam(req.body);
  crite.rows=rows;
  crite.page=page;
  //res.body
  CameraModel.count(crite, function(err, count){
    if(err){
      res.json({
         "success":false,
         "message":err.errors
      });
    }
    ct = count;
    CameraModel.list(crite, function(err,list){
      if(err){
        res.json({"success":false});
      }
      res.json({"success":true,
                "total":ct,
                "rowsCount":rows,
                "page":page,
                "rows":list});
    });
  });

};

exports.add = function (req, res) {
    var name =   req.body.name;
    CameraModel.findOne({ name:name,isDeleted:false}, function (err, adventure) {
        if(!adventure) {
            var camera = new CameraModel(req.body);
            //图片名称不能相同
            camera.save(function (err) {
                if (err) {
                    res.json({
                        "success": false,
                        "msg": "增加出错"
                    });
                } else {
                    res.json({
                        "success": true,
                        "_id": camera._id
                    });
                }
            });
        }else{
            res.json({
                "success":false,
                "msg":"分类名称已存在"
            });
        }
    });
};

exports.remove = function(req, res){
  var id = req.param("_id");
  CameraModel.removeById(id, res);
  //res.json(resp);
};

exports.updateById = function(req, res){
    var name =   req.body.name;
    CameraModel.findOne({ name:name,isDeleted:false}, function (err, adventure) {
        if(!adventure){
            CameraModel.updateCamera(req, res);
        }else{
            if(adventure._id==req.body._id){
                CameraModel.updateCamera(req, res);

            }else{
                res.json({
                    "success":false,
                    "msg":"名称已存在"
                });
            }
        }
    });

};

