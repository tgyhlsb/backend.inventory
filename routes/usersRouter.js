var express = require('express');
var router = express.Router();
var passport = require('passport');

// Controllers
var usersCtrl = require('usersCtrl');

// Middlewares
var auth = require('../config/middlewares/authorization');

router
.post('/',
  passport.authenticate('admin', { session: false }),
  usersCtrl.create,
  usersCtrl.showOne
  );


module.exports = router;
