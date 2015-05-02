var Mustache = require('mustache');
var fs = require('fs');
//need to install mustache


//The following code is need append to all the model file.
//And need to be modified.
/**********************CONFIG INFO BEGIN************************/

/*//********手动配置字段Start******
var ObjectSchema = ProductSchema;//Schema upside
var path = "product";//the path to of object
var endName = "product";//the name of object
var cnName = "产品";//the chinese name of object
//********手动配置字段End*******

var firstNameCapital = endName.charAt(0).toUpperCase()+endName.slice(1);
var config={
  path:path,
  endName:endName,
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
exports.config = config;*/


/************************CONFIG INFO END**********************/



//Load templates
var controllerTmpelate=fs.readFileSync('autogenerate/template/controller.js', 'utf8');
var routeTemplate=fs.readFileSync('autogenerate/template/route.js', 'utf8');
var ejsTemplate=fs.readFileSync('autogenerate/template/template.ejs', 'utf8');

//Create directory
if (!fs.existsSync("./autogenerate/generateddemo")){
    fs.mkdirSync("./autogenerate/generateddemo");
}
if (!fs.existsSync("./autogenerate/generateddemo/controller")){
    fs.mkdirSync("./autogenerate/generateddemo/controller");
}
if (!fs.existsSync("./autogenerate/generateddemo/route/")){
    fs.mkdirSync("./autogenerate/generateddemo/route/");
}
if (!fs.existsSync("./autogenerate/generateddemo/ejs/")){
    fs.mkdirSync("./autogenerate/generateddemo/ejs/");
}



//console.log(ejsTemplate)
var modelNames = ['product'];
var modelPath = "./app/models/";

modelNames.forEach(function(modelName){
  var modelObj = require(modelPath+modelName);
  //Generate controllerTmpelate
  var controllerTmpelateOutput = Mustache.render(controllerTmpelate, modelObj);
  var controllerPath = "./autogenerate/generateddemo/controller/"+modelName+"Ctrl.js";
  fs.writeFile(controllerPath, controllerTmpelateOutput, function(err) {
      if(err) {
        console.log("error----"+controllerPath);
        return console.log(err);
      }
      console.log(controllerPath+"--- Generate Finished");
  });
  //Generate routeTemplate
  var routeTemplateOutput = Mustache.render(routeTemplate, modelObj);
  var routePath = "./autogenerate/generateddemo/route/"+modelName+"Route.js";
  fs.writeFile(routePath, routeTemplateOutput, function(err) {
      if(err) {
        console.log("error----"+routePath);
        return console.log(err);
      }
      console.log(routePath+"--- Generate Finished");
  });
  //Generate ejsTemplate
  var ejsTemplateOutput = Mustache.render(ejsTemplate, modelObj);
  var ejsPath = "./autogenerate/generateddemo/ejs/"+modelName+".ejs";
  fs.writeFile(ejsPath, ejsTemplateOutput, function(err) {
      if(err) {
        console.log("error----"+ejsPath);
        return console.log(err);
      }
      console.log(ejsPath+"--- Generate Finished");
  });

});
