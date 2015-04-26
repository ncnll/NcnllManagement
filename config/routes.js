/*!
 * Module dependencies.
 */

var async = require('async');
var systemSetting = require('./systemSetting');

/**
 * Controllers
 */

var users = require('../app/controllers/manager');
/*  , articles = require('../app/controllers/articles')
  , auth = require('./middlewares/authorization')*/
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
