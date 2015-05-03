/*!
 * Module dependencies.
 */

var async = require('async');
var systemSetting = require('./systemSetting');

/**
 * Controllers
 */

var users = require('../app/controllers/manager');
var cameraCtrl = require('../app/controllers/camera');
var consumptionRecordCtrl = require('../app/controllers/consumer/consumptionRecord');
var imageInfoCtrl = require('../app/controllers/project/imageInfo');
var producePlaceCtrl = require('../app/controllers/project/producePlace');
var productCtrl = require('../app/controllers/project/product');
var productTypeCtrl = require('../app/controllers/project/productType');
var projectCtrl = require('../app/controllers/project/project');
 /*  , auth = require('./middlewares/authorization')*/
var indexRoute = require("../app/controllers/index");
var auth = require('./middlewares/authorization');


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
    app.all('/*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });
    //相机管理
    app.get("/device/camera/toSearchList", cameraCtrl.toSearchList);
    app.post("/device/camera/searchList", cameraCtrl.searchList);
    app.post("/device/camera/save", cameraCtrl.add);
    app.post("/device/camera/remove", cameraCtrl.remove);
    app.post("/device/camera/update", cameraCtrl.updateById);


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
    app.post("/vpi/userRegister", users.create);
    app.post("/vpi/getUsers", users.getUsers);
    app.post("/vpi/user/update", users.updateUserInfo);
    app.post("/vpi/userSessionInfo", users.userSessionInfo);
    app.post("/vpi/logout", users.logout);
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
    app.get('/loginSuccess', users.loginSuccess);
    app.get('/loginFailed', users.loginFailed);

};
