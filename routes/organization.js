var express = require('express');
var router = express.Router();
var organizations = require('organizations');
var passport = require('passport');

router
.get('/',
  passport.authenticate('basic', { session: false }),
  organizations.load,
  organizations.showOne
  )



module.exports = router;
