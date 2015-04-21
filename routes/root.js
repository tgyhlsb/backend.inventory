var express = require('express');
var router = express.Router();
var passport = require('passport');

// Routers
var usersRoutes = require('./usersRouter');
var organizationRoutes = require('./organizationRouter');

router.use('/users', usersRoutes);
router.use('/organizations', organizationRoutes);



module.exports = router;
