var express = require('express');
var router = express.Router();
var passport = require('passport');

// Controllers
var productsCtrl = require('productsCtrl');

// Middlewares
var auth = require('../config/middlewares/authorization');

router
.get('/',
  passport.authenticate('root', { session: false }),
  productsCtrl.fetch,
  productsCtrl.showAll
  )
.get('/:entityId',
  passport.authenticate('root', { session: false }),
  productsCtrl.select,
  productsCtrl.fetch,
  productsCtrl.showOne
  )
.post('/',
  passport.authenticate('root', { session: false }),
  productsCtrl.create,
  productsCtrl.showOne
  )
.post('/query/',
  passport.authenticate('root', { session: false }),
  productsCtrl.fetch,
  productsCtrl.showAll
  );


module.exports = router;
