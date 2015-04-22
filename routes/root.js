var express = require('express');
var router = express.Router();
var passport = require('passport');

// Routers
var usersRoutes = require('./usersRouter');
var organizationRoutes = require('./organizationRouter');
var entityTypeRoutes = require('./entityTypeRouter');

router.use('/users', usersRoutes);
router.use('/organizations', organizationRoutes);
router.use('/entityTypes', entityTypeRoutes);



module.exports = router;
