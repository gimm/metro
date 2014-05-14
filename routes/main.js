var router = require('express').Router();

router.route('/').all(function (req, res, next) {
    res.send('main router');
});

module.exports = router;