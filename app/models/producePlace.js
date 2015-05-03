/*********************************************************************/
/***********************生产点ProducePlace*********************/
/*********************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

/*
  a)生产点ID: id
  b)生产点地址:location
  c)负责人: personInChargeName
  d)负责人id：personInCharge
  e)设备描述：deviceDescription
  f)描述：description
*/

var ProducePlaceSchema = new Schema({
  // a)生产点ID: id
   _id:{type:ObjectIdSchema, default: new ObjectId()},

  // b)生产点地址:location
  location:{type:String, default:"", comment:"生产点地址"},
  // c)负责人姓名: personInCharge
  personInChargeName:{type:String, default:"", comment:"负责人姓名"},
  // d)负责人id：personId
  personInChargeId:{type:String, default:"", comment:"负责人ID"},
  // e)设备描述：deviceDescription
  deviceDescription:{type:String, default:"", comment:"生产设备描述"},
  // f)描述：description
  description:{type:String, default:"", comment:"生产点描述"},
});


ProducePlaceSchema.statics = {
  queryList: function (options, cb) {
    var criteria = options.criteria || {};
    this.find(criteria)
      .sort(options.sortObj)
      .limit(options.rows)
      .skip(options.rows * (options.page-1))
      .exec(cb);
      }
};

mongoose.model('ProducePlace', ProducePlaceSchema);



//The following code is need append to all the model file.
//And need to be modified.
/**********************CONFIG INFO BEGIN************************/

//********手动配置字段Start******
var ObjectSchema = ProducePlaceSchema;//Schema upside
var path = "project";//the path to of object
var endName = "producePlace";//the name of object
var cnName = "生产地点";//the chinese name of object
//********手动配置字段End*******

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


/************************CONFIG INFO END**********************/
