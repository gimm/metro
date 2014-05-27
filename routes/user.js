var router = require('express').Router();

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Group = mongoose.model('Group'),
    Preference = mongoose.model('Preference');

var LoginNeeded = {
    name: 'AuthError',
    err: 'login needed'
};

router.route('/')
    .get(function (req, res, next) {    //get current session user
        res.json(req.session.user);
    })
    .post(function (req, res, next) {   //create user - user sign
        var user = new User({
            name: req.param('name'),
            email: req.param('email'),
            password: req.param('password')
        });
        Preference.default(function(err, preference){
            if(err){
                next(err);
            }else{
                user.preference = preference.id;
                Group.default(function(err, group){
                    if(err){
                        next(err);
                    }else{
                        user.groups = [group.id];
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
    });

router.route('/:id([0-9a-fA-F]{24})')
    .get(function (req, res, next) {    //get user by id
        User.findById(req.params.id, function (err, user) {
            if(err){
                next(err);
            }else if(user){
                res.json(user);
            }else{
                next({name: 'NotFoundError', err: 'user not found'});
            }
        });
    })
    .put(function (req, res, next) {    //update user by id
        res.json('update user by id');
//        User.findByIdAndUpdate(req.params.id, function (err, user) {
//        });
    })
    .delete(function (req, res, next) { //remove user by id
        res.send('delete user by id');
    });

router.get('/list', function(req, res, next){
    User.find({}, function (err, users) {
        if(err){
            next(err);
        }else{
            res.json(users);
        }
    });
});

router.post('/auth', function (req, res, next) {
    var name = req.param('name');
    var password = req.param('password');
    User.findOne({name: name, password: password}, function (err, user) {
        if(err){
            next(err);
        }else if(user){
            req.session.user = user;
            res.json(user);
        }else{
            next({name: 'AuthError', err: 'login failed'});
        }
    });
});

router.post('/populate', function (req, res, next) {
    var name = req.param('name');
    var password = req.param('password');
    if(!(name && password)){
        if(req.session && req.session.user){
            name = req.session.user.name;
            password = req.session.user.password;
        }else{
            name = 'guest';
            password = 'guest';
        }
    }
    User.findOne({name: name, password: password}).populate('groups').populate('preference').exec(function (err, user) {
        var options = {path: 'groups.tiles.app', model: 'App', 'select': 'title identity'};
        User.populate(user, options, function (err, user) {
            res.json(user);
        });
    });

});



//app.all(prefix, function (req, res, next) {
//if (req.method === 'GET') {
//    User.find(function (err, users) {
//        if (err) {
//            next(err);
//        } else {
//            return res.json(users);
//        }
//    })
//} else if (req.method === 'POST') { //sign - create user
//    var user = new User({
//        name: req.param('name'),
//        email: req.param('email'),
//        password: req.param('password')
//    });
//    Preference.findOne({default: true}, function(err, preference){
//        if(err){
//            next(err);
//        }else{
//            user.preference = preference._id;
//            Group.findOne({order: 0}, function(err, group){
//                if(err){
//                    next(err);
//                }else{
//                    user.groups = [group._id];
//                    user.save(function (err, user) {
//                        if (err) {
//                            next(err);
//                        } else {
//                            req.session.user = user;
//                            return res.json(user);
//                        }
//                    })
//                }
//
//            });
//        }
//
//    });
//}
//});
//
//app.all(prefix + '/:id', function (req, res, next) {
//var id = req.params.id;
//if(id === 'current'){//get current login user
//    res.json(req.session.user);
//}else if(id === 'login'){
//    User.findOne({name: req.param('name')}, function (err, user) {
//        if(err){
//            next(err);
//        }else if(user.password !== req.param('password')){
//            next({name:'AuthError', err: 'password incorrect!'});
//        }else{
//            req.session.user = user;
//            res.json(user);
//        }
//    });
//}else if(id === 'tiles'){//populate user with groups and tiles info
//    var user = req.session.user;
//    if(true){
//        User.findById('5372d958d505d3c81620ef52').populate('groups').exec(function (err, user) {
//            User.populate(user,
//                {path: 'groups.tiles.app', model: 'App', 'select': 'title identity'},
//                function (err, u) {
//                console.log('with apps', user);
//                res.json(user.groups);
//            });
//        });
//    }else{
//        next({name: 'AuthError', err: 'session unavailable!'});
//    }
//}else{
//    var query = {_id: id};
//    if(req.method === 'GET'){
//        return User.findOne(query, function (err, group) {
//            if (!err) {
//                return res.json(group);
//            } else {
//                next(err);
//            }
//        });
//    }else if(req.method === 'PUT'){
//        return User.findOneAndUpdate(query, req.query, function (err, group) {
//            if (!err) {
//                return res.json(group);
//            } else {
//                next(err);
//            }
//        });
//    }else if(req.method === 'DELETE'){
//        return User.findOneAndRemove(query, function (err, group) {
//            if (!err) {
//                return res.json(group);
//            } else {
//                next(err);
//            }
//        });
//    }
//}
//});
module.exports = router;