// Original concepts provided by Backbone Boilerplate project: https://github.com/tbranyen/backbone-boilerplate
require.config({
  // Initialize the application with the main application file
  deps: ["main"],

  baseUrl: "js",

  paths: {
    // Libraries
    jquery: "libs/jquery.min",
    lodash: "libs/lodash.min",
    backbone: "libs/backbone.min",
    bootstrap:"/vendors/bootstrap/bootstrap-3.2.0/js/bootstrap",
    humane:"/vendors/humane/humane.min",
    spin:"/vendors/spin/spin.min",
    fileupload:"/vendors/fileupload/jquery.fileupload",
    uiWidget:"/vendors/fileupload/jquery.ui.widget",
    md5js:"/vendors/md5/md5.min",
    iframeTransport:"/vendors/fileupload/jquery.iframe-transport"
  },

  shim: {
    spin:{
      "deps" : ['jquery']
    },
    backbone: {
      deps: ["lodash", "jquery"],
      exports: "Backbone"
    },
    bootstrap:{ "deps" :['jquery'] },
    fileupload:{"deps":['uiWidget']}
  }
});
