
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
 *  Set organization with admin role
 */

exports.setAdminOf = function (req, res, next) {
  req.user.setOrganization(req.organization, Organization.roleAdmin);
  req.user.save(function (err) {
    if (err) return next(err);
    return next();
  });
};

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile;
  res.render('users/show', {
    title: user.name,
    user: user
  });
};

/**
 *  Show user
 */

exports.showOne = function (req, res, next) {
  if (!req.profile) return next(new Error('Profile can\'t be null'));
  res.status(200).json(req.profile);
};

exports.signin = function (req, res) {};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};
