var prefix = '/user';
module.exports = function (app) {
  app.get(prefix + '/name', function (req, res) {
     res.json({'name': 'XXX'});
  });
};

//exports.apps = function (req, res) {
//  res.json({'name': 'gimm'});
//};