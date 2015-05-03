/*********************************************************************/
/****************************产品类型ProductType**********************/
/*********************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

/*
  a)父级ID：parentId
  b)节点类型：叶子节点2，子树1，根节点0
  c)产品描述：description
  d)组成成分：components
  e)保质期(天):expireTime
  f)产品图片集合：images [xxx.jpg, bbb.jpg, ccc.jpg]
  g)产品标准ID：standardId-----外键
*/

var ProductTypeSchema = new Schema({

  _id:{type:ObjectIdSchema, default: new ObjectId()},
  // a)父级ID：parentId
  parentId:{type:String, default:"", comment:"父级ID"},
  // b)节点类型：叶子节点2，子树1，根节点0
  nodeType:{type:Number, default:"", comment:"节点类型"},
  // c)产品描述：description
  description:{type:String, default:"", comment:"产品描述"},
  // d)组成成分：components
  components:{type:String, default:"", comment:"组成成分"},
  // e)保质期(天):expireTime
  expireTime:{type:String, default:"", comment:"保质期(天)"},
  // f)产品图片集合：images [xxx.jpg, bbb.jpg, ccc.jpg]
  images:{type:[], default:"", comment:"产品图片集合"},
  // g)产品标准ID：standardId-----外键
  standardId:{type:String, default:"", comment:"产品标准ID"}
});


ProductTypeSchema.statics = {
  queryList: function (options, cb) {
    var criteria = options.criteria || {};
    this.find(criteria)
      .sort(options.sortObj)
      .limit(options.rows)
      .skip(options.rows * (options.page-1))
      .exec(cb);
      }
};

mongoose.model('ProductType', ProductTypeSchema);

//The following code is need append to all the model file.
//And need to be modified.
/**********************CONFIG INFO BEGIN************************/

//********手动配置字段Start******
var ObjectSchema = ProductTypeSchema;//Schema upside
var path = "project";//the path to of object
var endName = "productType";//the name of object
var cnName = "产品类型";//the chinese name of object
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
