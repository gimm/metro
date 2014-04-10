
var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongo = require('mongodb');

var app = module.exports.app = exports.app = express();
console.log('evn', app.get('env'));

var MongoStore = require('connect-mongo')(express);

// development only
app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(require('connect-livereload')({
        port: 35729
    }));
});
// production only
app.configure('production', function () {
    app.use(express.errorHandler());
});


/**
 * Configuration
 */
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.cookieParser());
    app.use(express.session({
        secret: '1234567890QWERTY',
        store: new MongoStore({
            db: 'metro'
        })
    }));
});


/**
 * Start Server
 */
http.createServer(app).listen(app.get('port'), function () {
    //check db
    var db = new mongo.Db('metro', new mongo.Server('localhost', 27017, {auto_reconnect: true}), {safe: false});
    db.open(function (err, db) {
        if (!err) {
            console.log("Connected to 'metro' database");
            db.collections(function (err, collections) {
                var collections =  collections.filter(function (collection) {
                    return collection.collectionName.indexOf('.') === -1;
                });
                if(collections.length === 0){
                    console.log("The core collections don't exist. Creating them with sample data...");
                    populateDB();
                }
            });
        }
    });
    console.log('Express server listening on port ' + app.get('port'));

    app.db = db;
    require('./routes')(app);
});

var populateDB = function () {
    var users = [
        {
            '_id': 1,
            'name': 'Gimm',
            'email': 'yucc2008@gmail.com',
            'role': 'user'
        }
    ];
    app.db.collection('users', function (err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });
    var apps = [
        {
            '_id': 1,
            name: 'App Store',
            codename: 'app-store',
            author: 1
        }
    ];
    app.db.collection('apps', function (err, collection) {
        collection.insert(apps, {safe:true}, function(err, result) {});
    });
    var userGroups = [
        {
            '_id': 1,
            name: 'Featured',
            order: 1
        }
    ];
    app.db.collection('user_groups', function (err, collection) {
        collection.insert(userGroups, {safe:true}, function(err, result) {});
    });
    var userApps = [
        {
            '_id': 1,
            user: 1,
            app: 1,
            group: 1,
            order: 1,
            size: 2
        }
    ];
    app.db.collection('user_apps', function (err, collection) {
        collection.insert(userApps, {safe:true}, function(err, result) {});
    });
};


