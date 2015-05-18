
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoStore = require('connect-mongo')(express)
  , flash = require('connect-flash')
  , winston = require('winston')
  , helpers = require('view-helpers')
  , pkg = require('../package.json')
var bodyParser = require('body-parser');
var multer  = require('multer');
var mongoose = require('mongoose');
var fs = require('fs');

var imageMagick = require('imagemagick');

var log4js = require('log4js');

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/cheese.log', category: 'cheese' }
  ]
});


var options = {
            uploadDir: './public/images',
            uploadUrl: '/files/',
            maxPostSize: 11000000000, // 11 GB
            minFileSize: 1,
            maxFileSize: 10000000000, // 10 GB
            acceptFileTypes: /.+/i,
            // Files not matched by this regular expression force a download dialog,
            // to prevent executing any scripts in the context of the service domain:
            inlineFileTypes: /\.(gif|jpe?g|png)$/i,
            imageTypes: /\.(gif|jpe?g|png)$/i,
            imageVersions: {
                'thumbnail': {
                    width: 200,
                    height: 200
                }
            },
            accessControl: {
                allowOrigin: '*',
                allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
                allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
            },
            /* Uncomment and edit this section to provide the service via HTTPS:
            ssl: {
                key: fs.readFileSync('/Applications/XAMPP/etc/ssl.key/server.key'),
                cert: fs.readFileSync('/Applications/XAMPP/etc/ssl.crt/server.crt')
            },
            */
            nodeStatic: {
                cache: 3600 // seconds to cache served files
            }
        };

var env = process.env.NODE_ENV || 'development'

module.exports = function (app, config, passport) {

  app.set('showStackError', true)

  // should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
    },
    level: 9
  }))

  app.use(express.favicon())
  app.use(express.static(config.root + '/public'))

  // Logging
  // Use winston on production
  var log;
  if (env !== 'development') {
    log = {
      stream: {
        write: function (message, encoding) {
          winston.info(message)
        }
      }
    }
  } else {
    log = 'dev'
  }
  // Don't log during tests
  if (env !== 'test') app.use(express.logger(log))

  // set views path, template engine and default layout
  app.set('views', config.root + '/app/views')
  app.set('view engine', 'ejs')

  app.configure(function () {
    // expose package.json to views
    app.use(function (req, res, next) {
      res.locals.pkg = pkg
      next()
    })

    //

    app.use(multer({
      dest: './uploads/',
      rename: function (fieldname, filename) {
        return mongoose.Types.ObjectId()
      },
      onFileUploadComplete: function (file) {

         fs.rename("./uploads/"+file.name, "./public/images/"+file.name, function(err) {

          var opts = options.imageVersions["thumbnail"];
            imageMagick.resize({
                width: opts.width,
                height: opts.height,
                srcPath: "./public/images/"+file.name,
                dstPath: options.uploadDir + '/thumbnail/'+ file.name
            }, function(){
              console.log("Converted from "+"./public/images/"+file.name+" to "+ options.uploadDir + '/thumbnail/'+ file.name+" OK")
            });


           console.log("./uploads/"+file.name + ' uploaded to  ' + "./public/images/"+file.name)

         });

      }
    }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    // cookieParser should be above session
    app.use(express.cookieParser())

    app.use(express.methodOverride())
    
    // express/mongo session storage
    app.use(express.session({
      secret: pkg.name,
      cookie:{maxAge: 900000},
      store: new mongoStore({
        url: config.db,
        collection : 'sessions',
        "clear_interval": 3600*60,
        "auto_reconnect": true,
        username : config.dbUserName,
        password : config.dbPassword
      })
    }))


    // use passport session
    app.use(passport.initialize())
    app.use(passport.session())
    // should be declared after session and flash
    app.use(helpers(pkg.name))


    // connect flash for flash messages - should be declared after sessions
    app.use(flash())
    // adds CSRF support
    /*if (process.env.NODE_ENV !== 'test') {
      app.use(express.csrf())

      // This could be moved to view-helpers :-)
      app.use(function(req, res, next){
        res.locals.csrf_token = req.csrfToken()
        next()
      })
    }*/

    // routes should be at the last
    app.use(app.router)

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next){
      // treat as 404
      if (err.message
        && (~err.message.indexOf('not found')
        || (~err.message.indexOf('Cast to ObjectId failed')))) {
        return next()
      }

      // log it
      // send emails if you want
      console.error(err.stack)

      // error page
      res.status(500).render('500', { error: err.stack })
    })

    // assume 404 since no middleware responded
    app.use(function(req, res, next){
      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
      })
    })
  })

  // development env config
  app.configure('development', function () {
    app.locals.pretty = true
  })
}
