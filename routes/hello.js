var express = require('express'),
    hello = express.Router();

hello.use('/:name', function (req, res) {
    res.send('hello ' + req.params.name);
});

hello.use(function (req, res) {
    res.send('hello world!');
})



module.exports = hello;