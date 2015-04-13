var express = require('express');
var router = express.Router();
var passport = require('passport');

// Controllers
var usersCtrl = require('usersCtrl');

// Middlewares
var auth = require('../config/middlewares/authorization');

/* GET usersCtrl listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', usersCtrl.login);
router.get('/signup', usersCtrl.signup);

router
.post('/',
  passport.authenticate('admin', { session: false }),
  usersCtrl.create,
  usersCtrl.showOne
  );


module.exports = router;
