/*********************************************************************/
/*****************************管理员Manager***************************/
/*********************************************************************/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * Manager Schema
 username,email,userrole,phonenumber,birthday,introduction,website,address
 */

var ManagerSchema = new Schema({

  /*  name: { type: String, default: '' },*/
  username: { type: String, default: '' },
  fullName:{type:String, default:''},
  email: { type: String, default: '' },
  //student:0, teacher:1
  userrole:{type:Number, default:0},
  //电话号码
  phonenumber: { type: String, default: '' },
  //userclass:{type:Schema.ObjectId, ref="Class"},
  //生日
  birthday:{ type: String, default: '' },
  //介绍
  introduction: { type: String, default: '' },
  //地址
  address : { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' },
  isDisabled:{type:Boolean, defalult:false},
  isDeleted:{type:Boolean, default:false},
  //用户头像地址
  userPhoto:{type:String},
  createDate:{type : Date, default : Date.now}
});

/**
 * Virtuals
 */

ManagerSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password; });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

// the below 5 validations only apply if you are signing up traditionally

/*ManagerSchema.path('name').validate(function (name) {
  if (this.doesNotRequireValidation()) return true
  return name.length
}, 'Name cannot be blank')*/

/*ManagerSchema.path('email').validate(function (email) {

  return email.length;
}, '邮箱地址不能为空');*/

/*ManagerSchema.path('email').validate(function (email, fn) {
  var Manager = mongoose.model('Manager');
  // Check only when it is a new Manager or when email field is modified
  if (this.isNew || this.isModified('email')) {
    Manager.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, '该邮箱已经被注册！');*/

ManagerSchema.path('username').validate(function (username, fn) {
  var Manager = mongoose.model('Manager');
  // Check only when it is a new Manager or when email field is modified
  if (this.isNew || this.isModified('username')) {
    Manager.find({ username: username }).exec(function (err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, '该用户名已经被注册！');

ManagerSchema.path('username').validate(function (username) {
  return username.length;
}, '用户名不能为空！');

ManagerSchema.path('hashed_password').validate(function (hashed_password) {
  return hashed_password.length;
}, '密码不能为空！');


/**
 * Pre-save hook
 */

ManagerSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password))
    next(new Error('密码无效！'));
  else
    next();
});

/**
 * Methods
 */

ManagerSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password) return ''
    var encrypred
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
      return encrypred
    } catch (err) {
      return ''
    }
  },

};

ManagerSchema.statics = {
  /**
  *更新用户信息
  *sessionManager: req中的user
  **/
  updateManagerInfo: function(userUpdate, sessionUser, callback){
    this.findOne({ username: sessionUser.username }, function (err, user) {
      if (err){
        res.json({success:false, message:err});
        return;
      }
      //Update fields
      user.username=userUpdate.username;
      user.userrole=userUpdate.userrole;
      user.fullname = userUpdate.fullName;
      user.phonenumber=userUpdate.phonenumber;
      user.birthday=userUpdate.birthday;
      user.introduction=userUpdate.introduction;
      user.website=userUpdate.website;
      user.address =userUpdate.address;
      user.isDisabled = userupdate.isDisabled;
      user.save(callback);
    });
  },

  list4AllManager: function (options, cb) {
    var criteria = options.criteria || {}
    console.log("==================",criteria);
    this.find(criteria)
      .select('username email userrole phonenumber birthday introduction website address userPhotoID isDisabled fullName createDate')
        .sort({'createDate':-1})
        // .populate('student')
        .limit(options.rows)
        .skip(options.rows * (options.page-1))
        .exec(cb)
  }


};

mongoose.model('Manager', ManagerSchema);
