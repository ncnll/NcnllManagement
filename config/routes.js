/*!
 * Module dependencies.
 */

var async = require('async');
var systemSetting = require('./systemSetting');

/**
 * Controllers
 */
//管理员
var managerCtrl = require('../app/controllers/manager');
var cameraCtrl = require('../app/controllers/camera');
//消费记录
var consumptionRecordCtrl = require('../app/controllers/consumer/consumptionRecord');
//相片信息Ctrl
var imageInfoCtrl = require('../app/controllers/project/imageInfo');
//生产点Ctrl
var producePlaceCtrl = require('../app/controllers/project/producePlace');
//产品Ctrl
var productCtrl = require('../app/controllers/project/product');
//产品类型Ctrl
var productTypeCtrl = require('../app/controllers/project/productType');
//项目Ctrl
var projectCtrl = require('../app/controllers/project/project');
 /*  , auth = require('./middlewares/authorization')*/
var indexRoute = require("../app/controllers/index");
var auth = require('./middlewares/authorization');

/***************/
//用户信息管理Ctrl
var userCtrl = require('../app/controllers/front/user');
//产品信息管理Ctrl
var productInfoCtrl = require('../app/controllers/front/productInfo');
//产品分类管理Ctrl
var categoryCtrl = require('../app/controllers/front/category');
//个人品牌管理Ctrl
var brandCtrl = require('../app/controllers/front/brand');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/*var flow = require("../lib/flow-node");*/
//var fileUploader = require("../app/controllers/fileUpload");

var log4js = require('log4js');

var logger = log4js.getLogger('cheese');

/**
 * Route middlewares
 */

var usreAuth = [auth.requiresLogin, auth.user.hasAdminTeacherAuthorization];

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  //载入配置文件到render
  app.locals(systemSetting);

  //禁用同源策略
 /* app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });*/
  //相机管理
  app.get("/device/camera/toSearchList", cameraCtrl.toSearchList);
  app.post("/device/camera/searchList", cameraCtrl.searchList);
  app.post("/device/camera/save", cameraCtrl.add);
  app.post("/device/camera/remove", cameraCtrl.remove);
  app.post("/device/camera/update", cameraCtrl.updateById);

  /**上传文件**/
  app.post("/index/uploadCommonFile", indexRoute.uploadCommonFile);

  //消费记录管理管理
  app.get("/consumer/consumptionRecord/toSearchList", consumptionRecordCtrl.toSearchList);
  app.post("/consumer/consumptionRecord/searchList", consumptionRecordCtrl.searchList);
  app.post("/consumer/consumptionRecord/save", consumptionRecordCtrl.add);
  app.post("/consumer/consumptionRecord/remove", consumptionRecordCtrl.remove);
  app.post("/consumer/consumptionRecord/update", consumptionRecordCtrl.updateById);
   //图片信息管理
  app.get("/project/imageInfo/toSearchList", imageInfoCtrl.toSearchList);
  app.post("/project/imageInfo/searchList", imageInfoCtrl.searchList);
  app.post("/project/imageInfo/save", imageInfoCtrl.add);
  app.post("/project/imageInfo/remove", imageInfoCtrl.remove);
  app.post("/project/imageInfo/update", imageInfoCtrl.updateById);
   //生产地点管理
  app.get("/project/producePlace/toSearchList", producePlaceCtrl.toSearchList);
  app.post("/project/producePlace/searchList", producePlaceCtrl.searchList);
  app.post("/project/producePlace/save", producePlaceCtrl.add);
  app.post("/project/producePlace/remove", producePlaceCtrl.remove);
  app.post("/project/producePlace/update", producePlaceCtrl.updateById);
   //产品管理
  app.get("/project/product/toSearchList", productCtrl.toSearchList);
  app.post("/project/product/searchList", productCtrl.searchList);
  app.post("/project/product/save", productCtrl.add);
  app.post("/project/product/remove", productCtrl.remove);
  app.post("/project/product/update", productCtrl.updateById);
   //产品类型管理
  app.get("/project/productType/toSearchList", productTypeCtrl.toSearchList);
  app.post("/project/productType/searchList", productTypeCtrl.searchList);
  app.post("/project/productType/save", productTypeCtrl.add);
  app.post("/project/productType/remove", productTypeCtrl.remove);
  app.post("/project/productType/update", productTypeCtrl.updateById);

   //生产项目管理
  app.get("/project/project/toSearchList", projectCtrl.toSearchList);
  app.post("/project/project/searchList", projectCtrl.searchList);
  app.post("/project/project/save", projectCtrl.add);
  app.post("/project/project/remove", projectCtrl.remove);
  app.post("/project/project/update", projectCtrl.updateById);

  app.get("/hello", indexRoute.index );
  app.get("/indexData",indexRoute.indexData);
 // app.get("/userProducts",indexRoute.userProducts);
  app.post("/vpi/userRegister", managerCtrl.create);
  app.post("/vpi/getUsers", managerCtrl.getUsers);
  app.post("/vpi/user/update", managerCtrl.updateUserInfo);
  app.post("/vpi/userSessionInfo", managerCtrl.userSessionInfo);
  app.post("/vpi/logout", managerCtrl.logout);
  app.post('/vpi/userLogin',function(req, res, next) {

    passport.authenticate('local', function(err, user, info) {
      // if (err) { return next(err); }
      console.log(req.body)

      if (err || !user) {
         res.json({success:false, error:info["message"]});
         return;
       }
       req.logIn(user, function(err) {
          if (err) { res.json({success:false, error:info["message"]}); return; }
          var tmpUsr ={};
          tmpUsr.id = req.user._id;
          tmpUsr.username = req.user.username;
          tmpUsr.password = "********";
         // logger.debug(req)
          res.json({success:true, session_token:req.sessionID, user:tmpUsr});
          return ;
      });

    })(req, res, next);
  });
  app.get('/loginSuccess', managerCtrl.loginSuccess);
  app.get('/loginFailed', managerCtrl.loginFailed);

  /******************前台相关管理***************/
   //用户信息管理
  app.get("/front/user/toSearchList", userCtrl.toSearchList);
  app.post("/front/user/searchList", userCtrl.searchList);
  app.post("/front/user/save", userCtrl.add);
  app.post("/front/user/remove", userCtrl.remove);
  app.post("/front/user/update", userCtrl.updateById);
   //产品信息管理
  app.get("/front/productInfo/toSearchList", productInfoCtrl.toSearchList);
  app.post("/front/productInfo/searchList", productInfoCtrl.searchList);
  app.post("/front/productInfo/save", productInfoCtrl.add);
  app.post("/front/productInfo/updateScrollImage", productInfoCtrl.updateScrollImage);
  app.post("/front/productInfo/remove", productInfoCtrl.remove);
  app.post("/front/productInfo/update", productInfoCtrl.updateById);
   //产品分类管理
  app.get("/front/category/toSearchList", categoryCtrl.toSearchList);
  app.post("/front/category/searchList", categoryCtrl.searchList);
  app.post("/front/category/save", categoryCtrl.add);
  app.post("/front/category/remove", categoryCtrl.remove);
  app.post("/front/category/update", categoryCtrl.updateById);
   //个人品牌管理
  app.get("/front/brand/toSearchList", brandCtrl.toSearchList);
  app.post("/front/brand/searchList", brandCtrl.searchList);
  app.post("/front/brand/save", brandCtrl.add);
  app.post("/front/brand/remove", brandCtrl.remove);
  app.post("/front/brand/update", brandCtrl.updateById);

};
