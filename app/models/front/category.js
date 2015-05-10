/*********************************************************************/
/****************************产品分类 Category************************/
/*********************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

var CategorySchema = new Schema({
  categoryName:{type:String, comment:"类型名称"},
  categoryOrderIndex:{type:Number, comment:"排序"},
  iconName:{type:String, comment:"图标名称"}
});

CategorySchema.statics = {
  queryList: function (options, cb) {
    var criteria = options.criteria || {};
    this.find(criteria)
      .sort(options.sortObj)
      .limit(options.rows)
      .skip(options.rows * (options.page-1))
      .exec(cb);
      }
};



mongoose.model("Category", CategorySchema);

/**--------------------------------------------------------------------------**/
/********手动配置字段Start*******/
var ObjectSchema = CategorySchema;//Schema upside
var path = "front";//the path to of object
var endName = "category";//the name of object
var cnName = "产品分类";//the chinese name of object
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



