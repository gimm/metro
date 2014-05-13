var prefix = '/user';

var mongoose = require('mongoose');
var User = mongoose.model('User'),
    Group = mongoose.model('Group'),
    Preference = mongoose.model('Preference');

module.exports = function (app) {
    app.all(prefix, function (req, res, next) {
        if (req.method === 'GET') {
            User.find(function (err, users) {
                if (err) {
                    next(err);
                } else {
                    return res.json(users);
                }
            })
        } else if (req.method === 'POST') { //sign - create user
            var user = new User({
                name: req.param('name'),
                email: req.param('email'),
                password: req.param('password')
            });
            Preference.findOne({default: true}, function(err, preference){
                if(err){
                    next(err);
                }else{
                    user.preference = preference._id;
                    Group.findOne({order: 0}, function(err, group){
                        if(err){
                            next(err);
                        }else{
                            user.groups = [group._id];
                            user.save(function (err, user) {
                                if (err) {
                                    next(err);
                                } else {
                                    req.session.user = user;
                                    return res.json(user);
                                }
                            })
                        }

                    });
                }

            });
        }
    });

    app.all(prefix + '/:id', function (req, res, next) {
        var id = req.params.id;
        if(id === 'current'){//get current login user
            res.json(req.session.user);
        }else if(id === 'login'){
            User.findOne({name: req.param('name')}, function (err, user) {
                if(err){
                    next(err);
                }else if(user.password !== req.param('password')){
                    next({name:'AuthError', err: 'password incorrect!'});
                }else{
                    req.session.user = user;
                    res.json(user);
                }
            });
        }else if(id === 'tiles'){//populate user with groups and tiles info
            var user = req.session.user;
            if(true){
                User.findById('5371cc7bdef38edb03dbaa06').populate('groups').exec(function (err, user) {
                    User.populate(user,
                        {path: 'groups.tiles.app', model: 'App', 'select': 'title identity'},
                        function (err, u) {
                        console.log('with apps', user);
                        res.json(user.groups);
                    });
                });
            }else{
                next({name: 'AuthError', err: 'session unavailable!'});
            }
        }else{
            var query = {_id: id};
            if(req.method === 'GET'){
                return User.findOne(query, function (err, group) {
                    if (!err) {
                        return res.json(group);
                    } else {
                        next(err);
                    }
                });
            }else if(req.method === 'PUT'){
                return User.findOneAndUpdate(query, req.query, function (err, group) {
                    if (!err) {
                        return res.json(group);
                    } else {
                        next(err);
                    }
                });
            }else if(req.method === 'DELETE'){
                return User.findOneAndRemove(query, function (err, group) {
                    if (!err) {
                        return res.json(group);
                    } else {
                        next(err);
                    }
                });
            }
        }
    });
};
