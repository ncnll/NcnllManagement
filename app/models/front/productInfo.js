/*********************************************************************/
/****************************产品信息 ProductInfo************************/
/*********************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

var ProductInfoSchema = new Schema({
  //产品名称
  productName:{type:String, default:'', comment:"产品名称"},
  //产品描述
  productDescription:{type:String, default:'', comment:"产品描述"},
  //产品类别
  //productCategory:{type:Schema.ObjectId, ref:'Category'},
  productCategory:{type:String, default:'', comment:"产品类别"},
  //产品产地
  productOriginPlace:{type:String, default:'', comment:"产品产地"},
  //购买链接
  linkToBuy:{type:String, default:'', comment:"购买链接"},
  //所属用户
  user:{type: Schema.ObjectId, ref:'User', comment:"所属用户"},
  //所属项目
  projectId:{type:String, default:'', comment:"所属项目"},
  //是否前台展示
  isShowFront:{type:Boolean, default:'', comment:"是否前台展示"},
  //item展示图片
  indexImgIds:{
    type:[{
      type:String
    }], 
    comment:"展示图片集合"
  },

  //浏览次数
  browseCount:{type:Number, defalult:0,comment:"浏览次数"},
  //点赞次数
  praisedUsers:{
    type:[{
      user:{type: Schema.ObjectId, ref:'User'},
      createdAt: { type : Date, default : Date.now }
    }],
    comment:"点赞次数"
  },

  //图片轮播
  scrollPics:{
    type:[{
      tabType:{type:Number},
      orderIndex:{type:Number},
      title:{type:String, default:''},
      description:{type:String, default:''},
      picIds:[{type:String, default:''}]
    }],
    comment:"图片轮播"
  },
  //缩时摄像
  timelapseVideos:{
    type:[{
      tabType:{type:Number},
      orderIndex:{type:Number},
      title:{type:String, default:''},
      videoLink:{type:String, default:''},
      description:{type:String, default:''}
    }],
    comment:"缩时摄像"
  },
  //实时图片
  realtimePics:{
    type:[{
      tabType:{type:Number},
      orderIndex:{type:Number},
      title:{type:String, default:''},
      realtimeID:{type:String, default:''},
      cameraId:{type:String, default:''},
      startTime:{type:Date},
      endTime:{type:Date},
      cameraIndex:{type:String, default:''},
      description:{type:String, default:''}
    }],
    comment:"实时图片"
  }

});

ProductInfoSchema.statics = {
  queryList: function (options, cb) {
    var criteria = options.criteria || {};
    this.find(criteria)
      .sort(options.sortObj)
      .limit(options.rows)
      .skip(options.rows * (options.page-1))
      .exec(cb);
      }
};

mongoose.model("ProductInfo", ProductInfoSchema);

/**--------------------------------------------------------------------------**/
/********手动配置字段Start*******/
var ObjectSchema = ProductInfoSchema;//Schema upside
var path = "front";//the path to of object
var endName = "productInfo";//the name of object
var cnName = "产品信息";//the chinese name of object
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

