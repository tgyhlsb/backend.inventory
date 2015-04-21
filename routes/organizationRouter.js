var express = require('express');
var router = express.Router();
var passport = require('passport');

// Controllers
var organizationsCtrl = require('organizationsCtrl');
var usersCtrl = require('usersCtrl');

router
.get('/',
  passport.authenticate('root', { session: false }),
  organizationsCtrl.fetch,
  organizationsCtrl.showAll
  )
.get('/:organizationId',
  passport.authenticate('root', { session: false }),
  organizationsCtrl.select,
  organizationsCtrl.fetch,
  organizationsCtrl.showOne
  )
.post('/',
  passport.authenticate('root', { session: false }),
  organizationsCtrl.create,
  organizationsCtrl.setOwner,
  usersCtrl.setAdminOf,
  organizationsCtrl.showOne
  )
.post('/query/',
  passport.authenticate('root', { session: false }),
  organizationsCtrl.fetch,
  organizationsCtrl.showAll
  );



module.exports = router;
