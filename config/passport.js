var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , Manager = mongoose.model('Manager')


module.exports = function (passport, config) {
  // require('./initializer')

  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    Manager.findOne({ _id: id }, function (err, user) {
      done(err, user)
    })
  })

  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username, password, done) {
      Manager.findOne({ username: username }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          return done(null, false, { message: '该用户名称未注册！' })
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: '用户名或者密码错误！' })
        }
        if(user.isDisabled){
          return done(null, false, { message: '用户已被禁用，请联系管理员！' })
        }
        if(user.isDeleted){
          return done(null, false, { message: '用户已被删除！' })
        }
        return done(null, user)
      })
    }
  ))

}
