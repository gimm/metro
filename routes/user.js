var prefix = '/user';

var mongoose = require('mongoose');
var User = require('mongoose').model('User');

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
        } else if (req.method === 'POST') { //sign
            var user = new User({
                name: req.param('name'),
                email: req.param('email'),
                password: req.param('password')
            });
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

    app.all(prefix + '/:id', function (req, res, next) {
        var slug = req.params.id;
        if(slug === 'current'){//get current login user
            res.json(req.session.user);
        }else if(slug === 'login'){
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
        }else{
            var query = {_id: slug};
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
