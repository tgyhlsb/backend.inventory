var express = require('express');
var router = express.Router();
var passport = require('passport');

// Controllers
var organizationsCtrl = require('organizationsCtrl');
var usersCtrl = require('usersCtrl');
var entityTypesCtrl = require('entityTypesCtrl');

router
.get('/',
  passport.authenticate('root', { session: false }),
  entityTypesCtrl.fetch,
  entityTypesCtrl.showAll
  )
.get('/:entityTypeId',
  passport.authenticate('root', { session: false }),
  entityTypesCtrl.select,
  entityTypesCtrl.fetch,
  entityTypesCtrl.showOne
  )
.post('/',
  passport.authenticate('root', { session: false }),
  entityTypesCtrl.fetchDuplicates,
  entityTypesCtrl.create,
  entityTypesCtrl.showOne
  )
.post('/query/',
  passport.authenticate('root', { session: false }),
  entityTypesCtrl.fetch,
  entityTypesCtrl.showAll
  );



module.exports = router;
