var express = require('express');
var router = express.Router();
var passport = require('passport');

// Routers
var usersRoutes = require('./usersRouter');
var organizationRoutes = require('./organizationRouter');
var entityTypeRoutes = require('./entityTypeRouter');
var entityRoutes = require('./entityRouter');
var productTypeRoutes = require('./productTypeRouter');
var productRoutes = require('./productRouter');

router.use('/users', usersRoutes);
router.use('/organizations', organizationRoutes);
router.use('/entityTypes', entityTypeRoutes);
router.use('/entities', entityRoutes);
router.use('/productTypes', productTypeRoutes);
router.use('/products', productRoutes);

module.exports = router;
