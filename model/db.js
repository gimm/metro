var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/metro';
// Create the database connection
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
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

var userSchema = new mongoose.Schema({
    name: {type: String, unique: true},
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
    order: {type: Number, required: true},
    size: {type: Number, enum: [1, 2], default: 2}
});

var groupSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true},
    order: { type: Number, required: true},
    tiles: [tileSchema]
});
var Group = mongoose.model('Group', groupSchema);

var appSchema = mongoose.Schema({
    title: {type: String, required: true, unique: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    updated: {type: Date, default: Date.now}
});
var App = mongoose.model('App', appSchema);