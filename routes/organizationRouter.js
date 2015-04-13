var express = require('express');
var router = express.Router();
var passport = require('passport');

// Controllers
var organizationsCtrl = require('organizationsCtrl');
var usersCtrl = require('usersCtrl');

router
.get('/',
  passport.authenticate('admin', { session: false }),
  organizationsCtrl.fetch,
  organizationsCtrl.showAll
  )
.get('/:organizationId',
  passport.authenticate('admin', { session: false }),
  organizationsCtrl.select,
  organizationsCtrl.fetch,
  organizationsCtrl.showOne
  )
.post('/',
  passport.authenticate('admin', { session: false }),
  organizationsCtrl.create,
  organizationsCtrl.setOwner,
  usersCtrl.setAdminOf,
  organizationsCtrl.showOne
  );



module.exports = router;
