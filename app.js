'use strict';

var express = require('express'),
    errorHandler = require('errorhandler'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    db = require('./model/db'),
    router = require('./routes');


var app = module.exports.app = exports.app = express();


/**
 * Configuration
 */
app.set('port', process.env.PORT || 3000);


//app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(router);
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    cookie: { secure: false, maxAge: 600000 }
    })
);


var env = app.get('env');
// development only
//if('development' === env) {n
////    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
//    app.use(require('connect-livereload')({
//        port: 35729
//    }));
//};
// production only
//if('production' === env) {
//    app.use(errorHandler());
//};

/**
 * Start Server
 */
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    db.connect();
//    require('./routes')(app);
//
//    app.use(function (err, req, res, next) {
//        if(req.xhr){
//            res.send(500, {error: err});
//        }else{
//            next(err);
//        }
//    });
//
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
});




