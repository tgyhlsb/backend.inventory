var express = require('express');
var router = express.Router();
var passport = require('passport');

// Controllers
var organizationsCtrl = require('organizationsCtrl');
var usersCtrl = require('usersCtrl');

router
.get('/',
  passport.authenticate('basic', { session: false }),
  organizationsCtrl.load,
  organizationsCtrl.showOne
  )
.post('/',
  passport.authenticate('basic', { session: false }),
  organizationsCtrl.create,
  organizationsCtrl.setOwner,
  usersCtrl.setAdminOf,
  organizationsCtrl.showOne
  );



module.exports = router;
