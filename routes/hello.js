var prefix = '/hello';
module.exports = function (app) {
  app.get(prefix, function (req, res) {
      res.send('hello world!');
  })
};