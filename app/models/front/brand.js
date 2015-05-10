/*********************************************************************/
/****************************生产者品牌Brand************************/
/*********************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

var BrandSchema = new Schema({
 
  brandname: { type: String, default: '' , comment:"品牌名称"},
  website: { type: String, default: '', comment:"拥有网站" },
  address:{type:String, default:'', comment:"总部地址"},
  introduction: { type: String, default: '', comment:"品牌介绍" },
  user: {type : Schema.ObjectId, ref : 'User', comment:"所有人"},
  userName: {type : String, default: '', comment:"所有人名称"},
  category:{
      type:[{name:{type:String, default:''}}],
      comment:"产品类别"
  },
  brandPhotoIds:{
      type:[{type:String}],
      comment:"品牌照片"
  },
});

BrandSchema.statics = {
  queryList: function (options, cb) {
    var criteria = options.criteria || {};
    this.find(criteria)
      .sort(options.sortObj)
      .limit(options.rows)
      .skip(options.rows * (options.page-1))
      .exec(cb);
      }
};


mongoose.model("Brand", BrandSchema);

/**--------------------------------------------------------------------------**/
/********手动配置字段Start*******/
var ObjectSchema = BrandSchema;//Schema upside
var path = "front";//the path to of object
var endName = "brand";//the name of object
var cnName = "个人品牌";//the chinese name of object
/********手动配置字段End*******/

var firstNameCapital = endName.charAt(0).toUpperCase()+endName.slice(1);
var config={
  path:path,
  name:endName,
  firstNameCapital:firstNameCapital,
  shema:ObjectSchema,
  cnName:cnName
};

//Get properties key value
var keyValues=[];
for(var prop in ObjectSchema.tree){
  if(prop=="__v" || prop=="_id" || prop=="id"){
    continue;
  }
  keyValues.push({name:prop, comment:ObjectSchema.tree[prop].comment, type:ObjectSchema.tree[prop].type});
}
exports.keyValues = keyValues;
exports.config = config;
