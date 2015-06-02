/*********************************************************************/
/****************************图片信息ImageInfo************************/
/*********************************************************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

/* 
  a)图片存储(云空间)
      i.图片口令验证 :token
      ii.图片裁剪存储（缩略图）:
      iii.获取图片相机编号:cameraSerialId
      iv.
  b)图片上传时间：uploadTime
  c)所属平台：阿里云，腾讯云，百度云 platform
  d)摄像时间：createTime
  e)传感器信息,sensorInfos：[]
      i.温度 temperature : 34.23
      ii.湿度 humidity : 94%
      iii.光照 illumination : 23
      iv...............
  f)所属项目:  projectId
  g)所属项目名称：projectName
  h)产品ID：productId（可以为空）
*/

var ImageInfoSchema = new Schema({
  //_id:{type:ObjectIdSchema, default: new ObjectId()},
  // a)图片存储(云空间)
//     i.图片口令验证 :token
//     ii.图片裁剪存储（缩略图）:
//     iii.获取图片相机编号:cameraSerialId
  name:{type:String, default:"", comment:"图片名称"},
  cameraSerialId : {type:String, default:"", comment:"相机编号"},
  //设备CPU编码
  deviceCpuId:{type:String, default:"", comment:"设备CPU编码"},
//     iv.
  // b)图片上传时间：uploadTime
  uploadTime : {type:Date, default:new Date(), comment:"上传时间"},
  // c)所属平台：阿里云，腾讯云，百度云， platform
  platform : {type:String, default:"", comment:"所属平台"},
  // d)摄像时间：createTime
  createTime : {type:Date, default:new Date(), comment:"摄像时间"},
  // e),sensorInfos：[]
  //     i.温度 temperature : 34.23
  //     ii.湿度 humidity : 94%
  //     iii.光照 illumination : 23
  //     iv...............
  sensorInfos : {type:{},comment:"传感器信息"},
  // f)所属项目:  projectId
  projectId : {type:String, default:"", comment:"所属项目"},
  // g)所属项目名称：projectName
  projectName : {type:String, default:"", comment:"所属项目名称"},
  // h)产品批次ID：productId（可以为空）
  productId : {type:String, default:"", comment:"所属产品批次ID"},
  // i)产品个体ID
  productItemId:{type:String, default:"", comment:"产品个体ID"},
  //i)描述：description
  description:{type:String, default:"", comment:"描述"}
});

ImageInfoSchema.statics = {
  queryList: function (options, cb) {
    var criteria = options.criteria || {};
    this.find(criteria)
      .sort(options.sortObj)
      .limit(options.rows)
      .skip(options.rows * (options.page-1))
      .exec(cb);
      }
};

mongoose.model('ImageInfo', ImageInfoSchema);

