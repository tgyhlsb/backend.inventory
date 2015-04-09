var express = require('express');
var router = express.Router();
var users = require('users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', users.login);
router.get('/signup', users.signup);


module.exports = router;
