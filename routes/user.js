var prefix = '/user';

var mongoose = require('mongoose');
var User = require('mongoose').model('User');

module.exports = function (app) {
  app.all(prefix, function (req, res) {
      if(req.method === 'GET'){
          User.find(function (err, users) {
              if(err){
                  return console.log(err);
              }else{
                  return res.json(users);
              }
          })
      }else if(req.method === 'POST'){
          var user = new User({
              name: req.param('name'),
              email: req.param('email'),
              password: req.param('password')
          });
          user.save(function (err, user) {
              if(err){
                  return console.log(err);
              }else{
                  return res.json(user);
              }
          })
      }
  });
};
