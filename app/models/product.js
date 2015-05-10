/*********************************************************************/
/****************************产品Product******************************/
/*********************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

/*
  i.所属项目id : projectId
  ii.项目名称：projectName
  iii.产品名称：name
  iv.产量:output
  v.单位：unit
  vi.产品特点描述: description
  vii.产品分类id：productTypeId
  viii.产品分类名称: productTypeName
  ix.生产日期：productDate
*/

var ProductSchema = new Schema({
   //_id:{type:ObjectIdSchema, default: new ObjectId()},
   //产品名称
   name: {type : String, default:0, comment:"产品名称"},
   //所属项目ID
   projectId: {type : String, default : '', trim : true, comment:"所属项目ID"},
   //项目名称
   projectName: {type : String, default : 0, comment:"所属项目名称"},
   //产量
   output: {type : String, default:0, comment:"产量"},
   //单位
   unit:{type : String, default:0, comment:"单位"},
   //特点描述
   description: {type : String, default:new Date(), comment:"特点描述"},
   //产品分类ID
   productTypeId: {type:String,default:0, comment:"产品分类ID"},
   //产品分类名称
   productTypeName: {type:String,default:0, comment:"产品分类名称"},
   //产品生产日期
   produceDate : {type:Date, default:new Date(), comment:"生产日期"}
});


ProductSchema.statics = {
  queryList: function (options, cb) {
    var criteria = options.criteria || {};
    this.find(criteria)
      .sort(options.sortObj)
      .limit(options.rows)
      .skip(options.rows * (options.page-1))
      .exec(cb);
      }
};

mongoose.model('Product', ProductSchema);

/**--------------------------------------------------------------------------**/
/********手动配置字段Start*******/
var ObjectSchema = ProductSchema;//Schema upside
var path = "project";//the path to of object
var endName = "product";//the name of object
var cnName = "产品";//the chinese name of object
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
