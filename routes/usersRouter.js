var express = require('express');
var router = express.Router();
var passport = require('passport');

// Controllers
var usersCtrl = require('usersCtrl');

// Middlewares
var auth = require('../config/middlewares/authorization');

router
.get('/',
  passport.authenticate('root', { session: false }),
  usersCtrl.fetch,
  usersCtrl.showAll
  )
.get('/:userId',
  passport.authenticate('root', { session: false }),
  usersCtrl.select,
  usersCtrl.fetch,
  usersCtrl.showOne
  )
.post('/',
  passport.authenticate('root', { session: false }),
  usersCtrl.create,
  usersCtrl.showOne
  )
.post('/query/',
  passport.authenticate('root', { session: false }),
  usersCtrl.fetch,
  usersCtrl.showAll
  );


module.exports = router;
