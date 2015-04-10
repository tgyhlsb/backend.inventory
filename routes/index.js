var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/basic',
  passport.authenticate('basic', { session: false }),
  function (req, res, next) {
    res.json({
      error: 0,
      strategy: 'basic',
      user: req.user
    });
});

module.exports = router;
