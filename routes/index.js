var path = require('path');

module.exports = function (app) {
    app.get('/', function () {
        res.send('hello');
    });

    require('./main')(app);
    require('./hello')(app);
    require('./user')(app);

    app.get('*.*', function (req, res) {
        var index = path.resolve('./' + req.url);
        res.sendfile(index);
    });

    app.get('*', function (req, res) {
        var index = path.resolve('./public/index.html');
        res.sendfile(index);
    });
};


