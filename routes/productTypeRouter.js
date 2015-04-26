var express = require('express');
var router = express.Router();
var passport = require('passport');

// Controllers
var organizationsCtrl = require('organizationsCtrl');
var usersCtrl = require('usersCtrl');
var productTypesCtrl = require('productTypesCtrl');

router
.get('/',
  passport.authenticate('root', { session: false }),
  productTypesCtrl.fetch,
  productTypesCtrl.showAll
  )
.get('/:entityTypeId',
  passport.authenticate('root', { session: false }),
  productTypesCtrl.select,
  productTypesCtrl.fetch,
  productTypesCtrl.showOne
  )
.post('/',
  passport.authenticate('root', { session: false }),
  productTypesCtrl.create,
  productTypesCtrl.showOne
  )
.post('/query/',
  passport.authenticate('root', { session: false }),
  productTypesCtrl.fetch,
  productTypesCtrl.showAll
  );



module.exports = router;
