var router = require('express').Router();

var mongoose = require('mongoose'),
    Group = mongoose.model('Group');

module.exports = router;
//module.exports = function (app) {
//    //create
//    app.all(prefix, function (req, res) {
//        if(req.method === 'GET'){
//            Group.find(function (err, groups) {
//                if (!err) {
//                    return res.json(groups);
//                } else {
//                    return console.log(err);
//                }
//            });
//        }else if(req.method === 'POST'){
//            var group = new Group({
//                title: req.param('title'),
//                order: req.param('order'),
//                tiles: req.param('tiles')
//            });
//            group.save(function (err) {
//                if (!err) {
//                    return console.log("created");
//                } else {
//                    return console.log(err);
//                }
//            });
//            res.json(group);
//        }
//    });
//
//    app.all(prefix + '/:id', function (req, res, next) {
//        var query = {'_id': req.params.id};
//        if(req.method === 'GET'){
//            return Group.findOne(query, function (err, group) {
//                if (!err) {
//                    return res.json(group);
//                } else {
//                    next(err);
//                }
//            });
//        }else if(req.method === 'PUT'){
//            return Group.findOneAndUpdate(query, req.query, function (err, group) {
//                    if (!err) {
//                        return res.json(group);
//                    } else {
//                        next(err);
//                    }
//            });
//        }else if(req.method === 'DELETE'){
//            return Group.findOneAndRemove(query, function (err, group) {
//                    if (!err) {
//                        return res.json(group);
//                    } else {
//                        next(err);
//                    }
//            });
//        }
//    })
//
//};
