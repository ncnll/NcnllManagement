/*!
 * Module dependencies.
 */

var async = require('async');


/**
 * Controllers
 */

/*  , articles = require('../app/controllers/articles')
  , auth = require('./middlewares/authorization')*/

var auth = require('../../middlewares/authorization');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/**
 * Route middlewares
 */

var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
var commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];
var backendAuth = [auth.requiresLogin, auth.user.hasAdminTeacherAuthorization]
/**
 * Expose routes
 */

module.exports = function (app, passport) {

    //后端登陆页面
    app.get("/backend/loginIndex", function(req, res){
      res.render("manage/login");
    });

    //后端首页
    app.get("/backend/index", backendAuth, function(req, res){
      res.render("manage/index",req.user);
    });

    //后端菜单
    app.get("/backend/menu/role", function(req, res){

        if(req.user.username=='admin'){
            res.json([
                /*{
                    "name":"系统管理",
                    "id":10,
                    "children":[
                                {
                                    "name":"首页内容管理",
                                    "id":11,
                                    "linkUrl":"/backend/system/mainPageManage"
                                }
                            ]
                },*/
                {
                    "name":"基础功能管理",
                    "id":1,
                    "children":
                    [
                        {
                            "name":"项目相关",
                            "children":[
                                {
                                    "name":"生产项目管理",
                                    "id":11,
                                    "linkUrl":"/project/project/toSearchList"
                                },{
                                    "name":"相机信息管理",
                                    "id":12,
                                    "linkUrl":"/device/camera/toSearchList"
                                },{
                                    "name":"上传图片管理",
                                    "id":13,
                                    "linkUrl":"/project/imageInfo/toSearchList"
                                },{
                                    "name":"产品类型管理",
                                    "id":14,
                                    "linkUrl":"/project/productType/toSearchList"
                                },{
                                    "name":"产品批次管理",
                                    "id":15,
                                    "linkUrl":"/project/product/toSearchList"
                                },{
                                    "name":"产品个体管理",
                                    "id":16,
                                    "linkUrl":"/project/productItem/toSearchList"
                                },{
                                    "name":"生产点管理",
                                    "id":16,
                                    "linkUrl":"/project/producePlace/toSearchList"
                                }
                            ]
                        },{
                            "name":"消费者相关",
                            "id":4,
                            "children":
                            [
                                {
                                    "name":"消费记录",
                                    "id":13,
                                    "linkUrl":"/consumer/consumptionRecord/toSearchList"

                                }

                            ]
                        },{
                            "name":"商城管理",
                            "children":
                            [
                                {
                                    "name":"用户信息管理",
                                    "linkUrl":"/front/user/toSearchList"

                                },
                                {
                                    "name":"产品信息管理",
                                    "linkUrl":"/front/productInfo/toSearchList"

                                },
                                {
                                    "name":"产品分类管理",
                                    "linkUrl":"/front/category/toSearchList"

                                },
                                {
                                    "name":"个人品牌管理",
                                    "linkUrl":"/front/brand/toSearchList"

                                }

                            ]
                        }

                    ]
                }
            ]);
        }


    });



};
