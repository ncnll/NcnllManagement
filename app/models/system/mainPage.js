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

var mainPageSchema = new Schema({
	//图片
	pictures:[{type: String, default : '',trim :true}],
	//分类描述
	introduction:{type : String, default : '', trim : true},
    //是否删除
    isDeleted:{type:Boolean, default:false},
    //创建日期
    createDate: {type : Date, default : Date.now}
});


mainPageSchema.statics = {
	 //修改
	 //使用upsert修改时找不到目标会添加一条
	 upsert:function(mainPage,res){
		 var main = mainPage;
		 delete main._id;
		 var pic =eval("("+mainPage.pictures+")");
		 main.pictures = pic;
		 console.log(main);
	 	this.update({},main,{multi: false,upsert:true}, function(err){
		      if(err){
		        res.json({
		        	"success":false,
		        	"msg":err
		        });
		      }else{
		        res.json({
		        	"success":true,
		        	"msg":"成功"
		        });
		      }
		    });
	 }
}

mongoose.model('mainPage', mainPageSchema);
