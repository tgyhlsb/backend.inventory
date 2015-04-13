var express = require('express');
var router = express.Router();
var passport = require('passport');

// Controllers
var usersCtrl = require('usersCtrl');

// Middlewares
var auth = require('../config/middlewares/authorization');

router
.get('/',
  passport.authenticate('admin', { session: false }),
  usersCtrl.fetch,
  usersCtrl.showAll
  )
.get('/:userId',
  passport.authenticate('admin', { session: false }),
  usersCtrl.select,
  usersCtrl.fetch,
  usersCtrl.showOne
  )
.post('/',
  passport.authenticate('admin', { session: false }),
  usersCtrl.create,
  usersCtrl.showOne
  )
.post('/query/',
  passport.authenticate('admin', { session: false }),
  usersCtrl.fetch,
  usersCtrl.showAll
  );


module.exports = router;
