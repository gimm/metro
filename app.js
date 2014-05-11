'use strict';

var express = require('express'),
    errorHandler = require('errorhandler'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    http = require('http'),
    path = require('path');


var app = module.exports.app = exports.app = express();

//set up some helper functions
app.helper = {
  mixin: function (target, source, create) {
      var sources = Array.prototype.slice.call(arguments, 1, arguments.length-1);
      create = arguments[arguments.length-1];
      if(typeof create === 'object'){
          sources.push(create);
          create = false;
      }

      sources.forEach(function (source) {
          for(var p in source){
              if(source.hasOwnProperty(p)){
                  if(target.hasOwnProperty(p) || create){
                      target[p] = source[p];
                  }
              }
          }
      });
      return target;
  }
};

var env = app.get('env');
// development only
if('development' === env) {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(require('connect-livereload')({
        port: 35729
    }));
};
// production only
if('production' === env) {
    app.use(errorHandler());
};


/**
 * Configuration
 */
app.set('port', process.env.PORT || 3000);
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(function (req, res, next) {
    req.data = app.helper.mixin(req.query, req.body, req.params, true);
    next();
});
    

/**
 * Start Server
 */
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    require('./model/db');
    require('./routes')(app);

});


