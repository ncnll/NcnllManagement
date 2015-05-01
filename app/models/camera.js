var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

/*a)相机编号（Serial Number CPU唯一编号），二维码录入？
b)相机配件管理
c)相机数字编码CameraId  000000001
d)相机型号
e)使用项目记录
f)购买日期
g)价格
h)状态*/

var CameraSchema = new Schema({

   _id:{type:ObjectIdSchema, default: new ObjectId()},
   //相机编号（Serial Number CPU唯一编号）
   serialNumber: {type : String, default : '', trim : true},
   //人类可读数字编号:0000001
   code: {type : Number, default : 0},
   //相机型号
   type: {type : String, default:0},
   //使用记录
   usedProjects: [],
   //配件
   components:[],
   //购买日期
   boughtDate: {type : Date, default:new Date()},
   //价值
   cost: {type:Number,default:0},
   //状态 0.空闲; 1.占用，2.维修，3.已经报废
   status:{type:Number, default:0},
   //描述
   description:{type:String, default:''}
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
