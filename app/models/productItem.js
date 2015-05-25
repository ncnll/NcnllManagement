/*********************************************************************/
/****************************产品个体ProductItem******************************/
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

var ProductItemSchema = new Schema({
   //_id:{type:ObjectIdSchema, default: new ObjectId()},
   //产品名称
   name: {type : String, default:0, comment:"产品名称"},
   //所属项目ID
   projectId: {type : String, default : '', trim : true, comment:"所属项目ID"},
   //项目名称
   projectName: {type : String, default : 0, comment:"所属项目名称"},
   //批次id
   productId:{},
   //批次名称
   productName:{},
   //产量
   output: {type : String, default:0, comment:"产量"},
   //单位
   unit:{type : String, default:0, comment:"单位"},
   // vii.项目开始时间 startTime，
   startTime:{type:Date, default:'', comment:"生成开始时间"},
   // viii.项目预估结束时间preEndTime
   preEndTime:{type:Date, default:'', comment:"该产品批次预估结束时间"},
   // ix.项目实际结束时间 endTime
   endTime:{type:Date, default:'', comment:"该产品批次实际结束时间"},
   //特点描述
   description: {type : String, default:new Date(), comment:"特点描述"},
   //产品分类ID
   productTypeId: {type:String,default:0, comment:"产品分类ID"},
   //产品分类名称
   productTypeName: {type:String,default:0, comment:"产品分类名称"},
   //产品生产日期
   produceDate : {type:Date, default:new Date(), comment:"生产日期"}
});


ProductItemSchema.statics = {
  queryList: function (options, cb) {
    var criteria = options.criteria || {};
    this.find(criteria)
      .sort(options.sortObj)
      .limit(options.rows)
      .skip(options.rows * (options.page-1))
      .exec(cb);
      }
};

mongoose.model('ProductItem', ProductItemSchema);

/**--------------------------------------------------------------------------**/
/********手动配置字段Start*******/
var ObjectSchema = ProductItemSchema;//Schema upside
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
