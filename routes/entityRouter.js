var express = require('express');
var router = express.Router();
var passport = require('passport');

// Controllers
var entitiesCtrl = require('entitiesCtrl');

// Middlewares
var auth = require('../config/middlewares/authorization');

router
.get('/',
  passport.authenticate('admin', { session: false }),
  entitiesCtrl.fetch,
  entitiesCtrl.showAll
  )
.get('/:entityId',
  passport.authenticate('admin', { session: false }),
  entitiesCtrl.select,
  entitiesCtrl.fetch,
  entitiesCtrl.showOne
  )
.post('/',
  passport.authenticate('admin', { session: false }),
  entitiesCtrl.create,
  entitiesCtrl.showOne
  )
.post('/query/',
  passport.authenticate('admin', { session: false }),
  entitiesCtrl.fetch,
  entitiesCtrl.showAll
  );


module.exports = router;
