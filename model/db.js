var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    preference: {type: mongoose.Schema.Types.ObjectId, ref: 'Preference'},
    groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}]
});
var User = mongoose.model('User', userSchema);

var preferenceSchema = mongoose.Schema({
    theme: {type: String, default: 'blue'}
});
var Preference = mongoose.model('Preference', preferenceSchema);



var tileSchema = new mongoose.Schema({
    app: {type: mongoose.Schema.Types.ObjectId, ref: 'App'},
    order: {type: Number, default: 1},
    size: {type: Number, enum: [1, 2], default: 2}
});

var groupSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true},
    tiles: [tileSchema]
});
var Group = mongoose.model('Group', groupSchema);

var appSchema = mongoose.Schema({
    title: {type: String, required: true},
    identity: {type: String, required: true, unique: true},
    author: {type: String, required: true, default: 'admin'},
    created: {type: Date, default: Date.now}
});
var App = mongoose.model('App', appSchema);


//initial data
var data = {
    users: [
        {
            name: 'admin',
            email: 'admin@metro.com',
            password: 'metro'
        },{
            name: 'guest',
            email: 'guest@metro.com',
            password: 'guest'
        }
    ],
    group: {
        title: 'System'
    },
    apps: [
        {
            title: 'Welcome',
            identity: 'welcome',
            created: new Date()

        }, {
            title: 'Settings',
            identity: 'settings',
            created: new Date()
        }, {
            title: 'About',
            identity: 'about',
            created: new Date()
        }
    ]
};

var dbURI = 'mongodb://localhost/metro';
// Create the database connection
mongoose.connect(dbURI);

var conn = mongoose.connection;
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);

    //init data
    mongoose.connection.db.collectionNames(function (err, collections) {
        mongoose.model('App').count({}, function(err, count){
            console.log('app count', count);
            if(count === 0){
                var appCollection = mongoose.model('App').collection;
                appCollection.insert(data.apps, function (err, apps) {
                    if(err){
                        console.log('err initialize app collection.');
                    }else{
                        console.log(apps);
                        var tiles = apps.map(function (app, index) {
                            return {
                                app: app._id,
                                order: index+1,
                                size: 2
                            };
                        });
                        data.groups = data.users.map(function () {
                            return {
                                title: data.group.title,
                                tiles: tiles
                            };
                        });

                        mongoose.model('Group').collection.insert(data.groups, function (err, groups) {
                           if(err){
                               console.log('err initialize groups collection.');
                           } else{
                               console.log(groups);
                               data.users.forEach(function (user, index) {
                                   user.groups = [groups[index]._id];
                               });
                               mongoose.model('User').collection.insert(data.users, function (err, users) {
                                   if(err){
                                       console.log('err initialize user collection.');
                                   } else {
                                       console.log(users);
                                   }
                               });
                           }
                        });
                    }
                });
            }
        });
    });
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});
