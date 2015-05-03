/*********************************************************************/
/***********************相机信息Camera*********************/
/*********************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

/*
  a)相机编号（Serial Number CPU唯一编号），二维码录入？
  b)相机配件管理
  c)相机数字编码CameraId  000000001
  d)相机型号
  e)使用项目记录
  f)购买日期
  g)价格
  h)状态
*/

var CameraSchema = new Schema({

   _id:{type:ObjectIdSchema, default: new ObjectId()},
   //相机编号（Serial Number CPU唯一编号）
   serialNumber: {type : String, default : '', trim : true, comment:"相机编号"},
   //人类可读数字编号:0000001
   code: {type : Number, default : 0, commet:"人类可读数字编号"},
   //相机型号
   type: {type : String, default:0, commet:"相机型号"},
   //使用记录
   usedProjects: [],
   //配件
   components:[],
   //购买日期
   boughtDate: {type : Date, default:new Date(), commet:"购买日期"},
   //价值
   cost: {type:Number,default:0, commet:"价值"},
   //状态 0.空闲; 1.占用，2.维修，3.已经报废
   status:{type:Number, default:0, commet:"状态"},
   //描述
   description:{type:String, default:'', commet:"描述"}
});


CameraSchema.statics = {
  queryList: function (options, cb) {
    var criteria = options.criteria || {};
    this.find(criteria)
      .sort(options.sortObj)
      .limit(options.rows)
      .skip(options.rows * (options.page-1))
      .exec(cb);
      }
};

mongoose.model('Camera', CameraSchema);

/**--------------------------------------------------------------------------**/
/********手动配置字段Start*******/
var ObjectSchema = CameraSchema;//Schema upside
var path = "project";//the path to of object
var endName = "camera";//the name of object
var cnName = "相机信息";//the chinese name of object
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
