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
  //_id:{type:ObjectIdSchema, default: new ObjectId()},
  //相机编号（Serial Number CPU唯一编号）
  serialNumber: {type : String, default : '', trim : true, comment:"相机编号"},
  //人类可读数字编号:0000001
  code: {type : Number, default : 0, comment:"人类可读数字编号"},
  //相机型号
  type: {type : String, default:0, comment:"相机型号"},
  //使用记录
  usedProjects: [],
  //配件
  components:[],
  //购买日期
  boughtDate: {type : Date, default:new Date(), comment:"购买日期"},
  //价值
  cost: {type:Number,default:0, comment:"价值"},
  //状态 0.空闲; 1.占用，2.维修，3.已经报废
  status:{type:Number, default:0, comment:"状态"},
  //描述
  description:{type:String, default:'', comment:"描述"},
  // f)所属项目:  projectId
  projectId : {type:String, default:"", comment:"所属项目"},
  // g)所属项目名称：projectName
  projectName : {type:String, default:"", comment:"所属项目名称"},
  // h)产品批次ID：productId（可以为空）
  productId : {type:String, default:"", comment:"所属产品批次ID"},
  // i)产品个体ID
  productItemId:{type:String, default:"", comment:"产品个体ID"},
  //i)描述：description
  description:{type:String, default:"", comment:"描述"},
  //拍摄种类：1-定时拍摄；2-个体触发式拍摄（rfid触发拍摄）；
  cameraType:{type:Number, default:"", comment:"拍摄类型"}, 
  //本地存储周期  Int 单位：秒
  localShootInterval:{type:Number, default:"", comment:"本地存储周期"}, 
  //上传服务器周期 Int 单位：秒
  uploadShootInterval:{type:Number, default:"", comment:"上传服务器周期"},
  //一天中摄像机工作时间  varchar 如：8-18 代表早上8点到晚上18点
  workingTime:{type:String, default:"", comment:"一天中摄像机工作时间"}, 
  //本地分辨率 varchar 如：1920*1080
  localResolution:{type:String, default:"", comment:"本地分辨率"}, 
  //上传用分辨率  varchar 如：1920*1080
  remoteResolution:{type:String, default:"", comment:"上传用分辨率"},  
  //最近更新时间  datetime  
  updateTime:{type:Date, default:"", comment:"最近更新时间"}, 
  //拍摄开始日期  datetime  
  startDate:{type:Date, default:"", comment:"拍摄开始日期"}, 
  //拍摄结束日期  datetime  
  endDate:{type:Date, default:"", comment:"拍摄结束日期"},
  //图片上传地址  varchar  
  uploadPath:{type:String, default:"", comment:"图片上传地址"}  
  //
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
var path = "device";//the path to of object
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
