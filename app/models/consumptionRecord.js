/*********************************************************************/
/***********************消费记录ConsumptionRecord*********************/
/*********************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

/*
  a)消费记录ID
  b)消费者ID:consumerId（加密过）
  c)产品ID:productId
  d)数量：amount {}
  e)购买日期：boughtTime
  f)金额:money
*/

var ConsumptionRecordSchema = new Schema({
  // a)消费记录ID
  _id:{type:ObjectIdSchema, default: new ObjectId()},

  // b)消费者ID:consumerId（加密过）
  consumerId:{type:String, default:"", comment:"消费者ID"},
  // c)产品ID:productId
  productId:{type:String, default:"", comment:"消费者ID"},
  // d)数量：amount {}
  amount :{type:String, default:"", comment:"消费者ID"},
  // e)购买日期：boughtTime
  boughtTime:{type:String, default:"", comment:"消费者ID"},
  // f)金额:money
  money:{type:{},comment:"金额"},


});


ConsumptionRecordSchema.statics = {
  queryList: function (options, cb) {
    var criteria = options.criteria || {};
    this.find(criteria)
      .sort(options.sortObj)
      .limit(options.rows)
      .skip(options.rows * (options.page-1))
      .exec(cb);
      }
};

mongoose.model('ConsumptionRecord', ConsumptionRecordSchema);



/**--------------------------------------------------------------------------**/
/********手动配置字段Start*******/
var ObjectSchema = ConsumptionRecordSchema;//Schema upside
var path = "consumer";//the path to of object
var endName = "consumptionRecord";//the name of object
var cnName = "消费记录管理";//the chinese name of object
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
