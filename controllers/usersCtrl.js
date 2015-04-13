
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../lib/utils');

// Models
var User = mongoose.model('User');
var Organization = mongoose.model('Organization');

/**
 * Select - select which organization to load (user's one or params)
 */

exports.select = function (req, res, next) {
  req.body.criteria = {
    _id: req.params.userId
  };
  return next();
};

/**
 * Fetch
 */

exports.fetch = function (req, res, next) {
  var options = req.body;
  User.fetch(options, function (err, users) {
    if (err) return next(err);
    if (!users) return next(utils.error(500, 'Failed to find users'));
    req.profiles = users;
    next();
  });
};

/**
 * Create user
 */

exports.create = function (req, res, next) {
  var user = new User(req.body);
  if (!user) return next(utils.error(500, 'Failed to create user'));
  user.save(function (err) {
    if (err) return next(err);
    req.profile = user;
    next();
  });
};

/**
 *  Set user's organization with admin role
 */

exports.setAdminOf = function (req, res, next) {
  req.user.setOrganization(req.organization, Organization.roleAdmin);
  req.user.save(function (err) {
    if (err) return next(err);
    return next();
  });
};

/**
 *  Show one profile
 */

exports.showOne = function (req, res, next) {
  var profile = req.profile || req.profiles[0];
  if (!profile) return next(utils.error(400, 'Profile can\'t be null'));
  res.status(200).json(profile);
};

/**
 *  Show all profiles
 */

exports.showAll = function (req, res, next) {
  if (!req.profiles) return next(utils.error(400, 'Profile can\'t be null'));
  res.status(200).json(req.profiles);
};
