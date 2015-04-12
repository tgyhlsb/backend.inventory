var express = require('express');
var router = express.Router();
var passport = require('passport');

// Controllers
var organizations = require('organizations');
var users = require('users');

router
.get('/',
  passport.authenticate('basic', { session: false }),
  organizations.load,
  organizations.showOne
  )
.post('/',
  passport.authenticate('basic', { session: false }),
  organizations.create,
  organizations.setOwner,
  users.setAdminOf,
  organizations.showOne
  );



module.exports = router;
