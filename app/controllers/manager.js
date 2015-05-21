process.env.TMPDIR = 'tmp'; // to avoid the EXDEV rename error, see http://stackoverflow.com/q/21071303/76173


/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('Manager')
  , utils = require('../../lib/utils')
  , passport = require('passport');

var login = function (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};

/**
 * Auth callback
 */

/*exports.authCallback = login*/

/**
 * Show login form
 */
/*exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login',
    message: req.flash('error')
  })
}
*/
//Login failed
exports.loginFailed = function (req, res) {
  res.json({success:false, error:req.flash('error')[0]});
};
//Login successfully
exports.loginSuccess = function (req, res) {
  /* var redirectTo = req.session.returnTo ? req.session.returnTo : '/'
  delete req.session.returnTo
  res.redirect(redirectTo)*/
  // utils.trimSensitiveUserInfo(req.user);
  var tmpUsr ={};
  tmpUsr.id = req.user._id;
  tmpUsr.username = req.user.username;
  tmpUsr.password = "********";
  res.json({success:true, session_token:req.sessionID, user:tmpUsr});
};


/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.json({
      success : true
   });
};

/**
 * Session
 */

exports.session = login;

/**
 * Create user
 */
//用户注册
exports.create = function (req, res) {
  var user = new User(req.body);

  user.provider = 'local';
  user.save(function (err) {
    if(err){
        res.json({
          success:false,
          "error":err.errors,
          "account_id":"",
          "msg":"注册消息失败"
        });
        return;
    }
    // manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err){
        res.json({
          success:false,
          error:err.errors
        });
      }
      res.json({
          success : true,
          "account_id":user._id,
          "msg":"注册消息成功"
      });

    });

  });
};

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile;
  res.render('users/show', {
    title: user.name,
    user: user
  });
};

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
};

//session中的user信息
exports.userSessionInfo = function(req, res){

  if(req.user){
    utils.trimSensitiveUserInfo(req.user);
    res.json(req.user);
  }else{
    res.json({"logined":false});
  }
};

/*****更新用户信息******/
exports.updateUserInfo = function(req, res){
  var userUpdate = new User(req.body);
  var userId = req.body._id;
  delete req.body._id;

  User.update({_id:userId}, req.body, function(err){
    if(!err) {
      res.json({success:true});
    }
    else {
      res.json({success:false, message:err});
    }
  });


};


/***************修改密码***************/
exports.changePassword = function(req, res){
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;
  if(req.user.authenticate(oldPassword)){
    //update
    User.findOne({ _id: req.user._id}, function (err, user) {
      user.password = newPassword;
      user.save(function(err){
        if(!err) {
          res.json({success:true});
          return;
        }
        else {
          res.json({success:false, message:"内部错误!"});
        }
      });
    });
  }else{
    //return error info
     res.json({success:false, message:'当前密码有误!'});
  }


  /*var userUpdate = new User();
  userUpdate.password = newPass
  word;
  userUpdate.salt = req.user.salt;
*/
  /*User.updateUserInfo(userUpdate, req.user, function(err) {
    if(!err) {
      res.json({success:true});
    }
    else {
      res.json({success:false, message:err});
    }
  });*/
};

/***************修改密码***************/
exports.resetPassword = function(req, res){
     //update
    User.findOne({ _id: req.body._id}, function (err, user) {
      user.password = "5b1b68a9abf4d2cd155c81a9225fd158";
      user.save(function(err){
        if(!err) {
          res.json({success:true});
          return;
        }
        else {
          res.json({success:false, message:"内部错误!"});
        }
      });
    });
};



exports.getUsers = function(req, res){
  var rows = req.body.rows;
  var page = req.body.page;
  delete req.body.rows;
  delete req.body.page;
  req.body.isDeleted = false;
  if(req.body.isDisabled==''){
    delete req.body.isDisabled;
  }
  User.count(req.body, function(err, count){
    if(err){
      res.json({
         "success":false,
         "message":err.errors
      });
    }

    if(req.body.username){
      if(req.body.username==""){
        delete req.body.username;
      }
      req.body.username =  new RegExp('^.*'+req.body.username+'.*$', "i");
    }
    User.list4AllUser({rows:rows,page:page,criteria:req.body}, function(err,list){
      if(err){
        res.json({"success":false});
      }
        res.json({"success":true,
                  "total":count,
                  "rowsCount":rows,
                  "page":page,
                  "rows":list});
    });
  });

};

// Handle cross-domain requests
exports.uploadGetStatus = function(req, res) {
     res.send(200, 404);
};


exports.teacherSave = function(req, res){
  var user = new User(req.body);
  user.save(function (err) {
    if(err){
        res.json({
          success:false,
          "error":err,
          "account_id":"",
          "msg":"注册消息失败,请核对用户名是否重复"
        });
        return;
    }else{
      res.json({
          success : true,
          "account_id":user._id,
          "msg":"注册消息成功"
       });
    }

  });
};



