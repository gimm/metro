var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/metro';

module.exports = exports = {
    connect: function () {
        // Create the database connection
        mongoose.connect(dbURI);
    }
};

var userSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    preference: {type: mongoose.Schema.Types.ObjectId, ref: 'Preference'},
    groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}]
});
userSchema.statics.guest = function (fn) {
    this.findOne({name: 'guest'}, fn);
};
var User = mongoose.model('User', userSchema);

var preferenceSchema = mongoose.Schema({
    theme: {type: String, default: 'blue'},
    default: {type: Boolean, default: false}
});
preferenceSchema.statics.default = function (fn) {
    this.find({default: true}, fn);
}
var Preference = mongoose.model('Preference', preferenceSchema);



var tileSchema = new mongoose.Schema({
    app: {type: mongoose.Schema.Types.ObjectId, ref: 'App'},
    order: {type: Number, default: 1},
    size: {type: String, enum: ['half', 'default', 'double'], default: 'default'}
});

var groupSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true},
    tiles: [tileSchema],
    order: {type: Number, default: 1}
});
groupSchema.statics.default = function (fn) {
    this.find({order: 0}, fn);
}
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
    ],
    preferences: [
        {
            theme: 'green'
        },{
            theme: 'blue',
            default: true
        }
    ]
};



mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);

    //init data
    mongoose.connection.db.collectionNames(function (err, collections) {
        mongoose.model('App').count({}, function(err, count){
            if(count === 0){
                var appCollection = mongoose.model('App').collection;
                appCollection.insert(data.apps, function (err, apps) {
                    if(err){
                        console.log('err initialize app collection.');
                    }else{
                        var tiles = apps.map(function (app, index) {
                            return {
                                app: app._id,
                                order: index+1,
                                size: 'double'
                            };
                        });
                        data.groups = data.users.map(function () {
                            return {
                                title: data.group.title,
                                tiles: tiles,
                                order: 1
                            };
                        });
                        data.groups.push({
                            title: data.group.title,
                            tiles: tiles,
                            order: 0
                        });

                        mongoose.model('Group').collection.insert(data.groups, function (err, groups) {
                           if(err){
                               console.log('err initialize groups collection.');
                           } else{
                                mongoose.model('Preference').collection.insert(data.preferences, function (err, preferences) {
                                    if(err){
                                        console.log('err initialize preferences collection');
                                    }else{
                                        var defaultPreference = preferences.filter(function (preference) {
                                            return preference.default;
                                        }).pop();
                                        groups.filter(function (group) {
                                            return group.order;
                                        }).forEach(function (group, index) {
                                            var user = data.users[index];
                                            user.groups = [group._id];
                                            user.preference = defaultPreference._id;
                                        });
                                        mongoose.model('User').collection.insert(data.users, function (err, users) {
                                            if(err){
                                                console.log('err initialize user collection.');
                                            }
                                        });
                                    }
                                });
                           }
                        });
                    }
                });
            }

            //try out
            var User = mongoose.model('User');
            var Group = mongoose.model('Group');
            User.findOne({name: 'admin'}).populate('groups').populate({path: 'groups.tiles.app', model: 'App'}).exec(function (err, user) {
                console.log('user', user);
                User.populate(user, {path: 'groups.tiles.app', model: 'App'}, function (err, u) {
                    console.log('with apps', user);
                });
            });

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
