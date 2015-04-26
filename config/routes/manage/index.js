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
                    "name":"基础数据管理",
                    "id":1,
                    "children":
                    [
                        {
                            "name":"班级",
                            "children":[
                                {
                                    "name":"班级分类管理",
                                    "id":2,
                                    "linkUrl":"/backend/class/classTypeManage"
                                },{
                                    "name":"班级管理",
                                    "id":3,
                                    "linkUrl":"/backend/class/classManage"
                                }
                            ]
                        },{
                            "name":"学员",
                            "id":4,
                            "children":
                            [
                                {
                                    "name":"学员报班管理",
                                    "id":13,
                                    "linkUrl":"/backend/student/studentManage"

                                },{
                                "name":"学员管理",
                                "id":13,
                                "linkUrl":"/backend/student/student"

                            },{
                                "name":"学员审核",
                                "id":13,
                                "linkUrl":"/backend/student/stuStatus"

                            }


                            ]
                        },{
                            "name":"教师",
                            "id":4,
                            "children":
                            [
                                {
                                    "name":"教师管理",
                                    "id":12,
                                    "linkUrl":"/backend/teacher/index"

                                }

                            ]
                            //"linkUrl":"/backend/student/studentManage"
                        },{
                            "name":"教程",
                            "id":5,
                            "linkUrl":"/backend/lesson/lessonManage",
                            "children":
                            [
                                {
                                    "name":"教程管理",
                                    "id":12,
                                    "linkUrl":"/backend/lesson/lessonManage"

                                }


                            ]
                        },{
                            "name":"作业、图片管理",
                            "id":6,
                            "children":[
                                /*{
                                    "name":"图片分类管理",
                                    "id":7,
                                    "linkUrl":"/backend/picture/pictureTypeManage"
                                },*/{
                                    "name":"图片审核",
                                    "id":9,
                                    "linkUrl":"/backend/pictures/pictureManage"
                                }
                            ]
                        }

                    ]
                }
            ]);
        }

        if(req.user.userrole==1){
            res.json([
               {
                    "name":"基础数据管理",
                    "id":1,
                    "children":
                    [
                        {
                            "name":"班级",
                            "children":[
                                {
                                    "name":"班级分类管理",
                                    "id":2,
                                    "linkUrl":"/backend/class/classTypeManage"
                                },{
                                    "name":"班级管理",
                                    "id":3,
                                    "linkUrl":"/backend/class/classManage"
                                }
                            ]
                        },{
                            "name":"学员",
                            "id":4,
                            "children":
                            [
                                {
                                    "name":"学员管理",
                                    "id":13,
                                    "linkUrl":"/backend/student/studentManage"

                                }


                            ]
                        },{
                            "name":"教程",
                            "id":5,
                            "linkUrl":"/backend/lesson/lessonManage",
                            "children":
                            [
                                {
                                    "name":"教程管理",
                                    "id":12,
                                    "linkUrl":"/backend/lesson/lessonManage"

                                }


                            ]
                        },{
                            "name":"作业、图片管理",
                            "id":6,
                            "children":[
                                /*{
                                    "name":"图片分类管理",
                                    "id":7,
                                    "linkUrl":"/backend/picture/pictureTypeManage"
                                },*/{
                                    "name":"图片审核",
                                    "id":9,
                                    "linkUrl":"/backend/pictures/pictureManage"
                                }
                            ]
                        }

                    ]
                }
            ]);
        }

    });



};
