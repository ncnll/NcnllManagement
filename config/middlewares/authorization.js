
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  if (req.method == 'GET') req.session.returnTo = req.originalUrl;
  res.redirect('/backend/loginIndex');
};

exports.requiresLoginJson = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  if (req.method == 'GET') req.session.returnTo = req.originalUrl;
  res.json({
      "success":false,
      "loginStatus":"offline",
      "msg":"已经离线!"
  });
};

exports.requiresLoginTxt = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  if (req.method == 'GET') req.session.returnTo = req.originalUrl;
  res.send("authFalse");
};




/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/backend/loginIndex')
    }
    next();
  },
  hasAdminTeacherAuthorizationJson: function (req, res, next) {
    if (req.user.username == "admin" || req.user.userrole == 1) {
      next(); 
      return;
    }
    return res.json({
                      "success":false,
                      "loginStatus":"noAuthority",
                      "msg":"无操作权限"
                    });
    
  },
  hasAdminTeacherAuthorization: function (req, res, next) {
    if (req.user.username == "admin" || req.user.userrole == 1) {
      next(); 
      return;
    }
   //return res.redirect('/backend/loginIndex')
    return res.json({
                      "success":false,
                      "loginStatus":"noAuthority",
                      "msg":"无操作权限"
                    });
  }
};

/*
 *  Article authorization routing middleware
 */

exports.article = {
  hasAuthorization: function (req, res, next) {
    if (req.article.user.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/articles/' + req.article.id)
    }
    next();
  }
};

/**
 * Comment authorization routing middleware
 */

exports.comment = {
  hasAuthorization: function (req, res, next) {
    // if the current user is comment owner or article owner
    // give them authority to delete
    if (req.user.id === req.comment.user.id || req.user.id === req.article.user.id) {
      next();
    } else {
      req.flash('info', 'You are not authorized');
      res.redirect('/articles/' + req.article.id);
    }
  }
};

// Middleware
exports.requireRole = {
  requireRole: function(userrole) {
    return function(req, res, next) {
      if(req.user && req.user.userrole === userrole)
        next();
      else
        res.send(403);
    };
  }
};
