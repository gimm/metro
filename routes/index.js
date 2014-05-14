var express = require('express'),
    path = require('path'),
    fs = require('fs');

var router = express.Router();


fs.readdirSync(__dirname).forEach(function (filename) {
    console.log(__filename);
    var match = /(.+).js$/.exec(filename);
    if(match && filename!='index.js'){
        var routeName = '/' + match.pop();
        router.use(routeName, require('.' + routeName));
    }
});


router.get('/index/:id([0-9a-fA-F]{24})', function (req, res, next) {
    res.send('id', req.params.id);
});
router.get('*.*', function (req, res) {
    var index = path.resolve('./' + req.url);
    res.sendfile(index);
});

router.get('*', function (req, res) {
    var index = path.resolve('./public/index.html');
    res.sendfile(index);
});

module.exports = router;


