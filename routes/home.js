const { Router } = require('express');
const router = Router();

router.get('/', function (req, res, next) {
    res.render('home/index', {
        title: 'Home'
    });
});

module.exports = router;