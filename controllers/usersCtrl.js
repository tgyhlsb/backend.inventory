
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../lib/utils');

// Models
var User = mongoose.model('User');
var Organization = mongoose.model('Organization');

/**
 * Load
 */

exports.load = function (req, res, next, id) {
  var options = {
    criteria: { _id : id }
  };
  User.load(options, function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};

/**
 * Create user
 */

exports.create = function (req, res, next) {
  var user = new User(req.body);
  if (!user) return next(new Error('Failed to create user'));
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
  if (!req.profile) return next(new Error('Profile can\'t be null'));
  res.status(200).json(req.profile);
};
