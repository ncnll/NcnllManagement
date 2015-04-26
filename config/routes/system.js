/*!
 * Module dependencies.
 */

var async = require('async');


/**
 * Controllers
 */

var mainPage = require('../../app/controllers/system/mainPage');
/*  , articles = require('../app/controllers/articles')
  , auth = require('./middlewares/authorization')*/

var auth = require('../middlewares/authorization');


var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();




/**
 * Route middlewares
 */

var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
var commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

/**
 * Expose routes
 */

module.exports = function (app, passport) {

    //修改
    app.post('/vpi/mainpage/update', auth.requiresLoginJson, mainPage.update);

    app.post('/vpi/mainpage/content', auth.requiresLoginJson, mainPage.list);

    // app.post('/vpi/mainpage/add', mainPage.add);
    //管理界面
    app.get("/backend/system/mainPageManage", function(req, res){
      res.render("manage/system/mainPageManage");
    });
};
