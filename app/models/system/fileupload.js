/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * User Schema
 username,email,userrole,phonenumber,birthday,introduction,website,address
 */

var fileUploadedSchema = new Schema({
	//原始名称
	originalname:[{type: String, default : '',trim :true}],
	//唯一名称
	uniquename:{type : String, default : '', trim : true},
	//上传人
	uploadUser : {type:Schema.ObjectId, ref : 'User'},
    //是否删除
    isDeleted:{type:Boolean, default:false},
    //创建日期
    createDate: {type : Date, default : Date.now},
});




mongoose.model('fileUploadedSchema', fileUploadedSchema);
