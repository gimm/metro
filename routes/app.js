var prefix = '/app';
module.exports = function (app) {
  app.get(prefix + '/list', function (req, res) {
      res.json(['News', 'Weather']);
  })
};