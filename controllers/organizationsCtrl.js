
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../lib/utils');

// Models
var Organization = mongoose.model('Organization');
var User = mongoose.model('User');

/**
 * Select - select which organization to load
 */

exports.select = function (req, res, next) {
  req.body.criteria = {
    _id: req.params.organizationId
  };
  return next();
};

/**
 * Load - load user's organization
 */

exports.load = function (req, res, next) {
  var organizationId = req.user.organization.id;
  if (!organizationId) return next(utils.error(400, 'OrganizationId not set'));
  var options = {
    criteria: { _id : organizationId }
  };
  Organization.load(options, function (err, organization) {
    if (err) return next(err);
    if (!organization) return next(utils.error(500, 'Failed to load Organization ' + organizationId));
    req.organization = organization;
    next();
  });
};

/**
 * Fetch
 */

exports.fetch = function (req, res, next) {
  var options = req.body;
  Organization.fetch(options, function (err, organizations) {
    if (err) return next(err);
    if (!organizations) return next(utils.error(500, 'Failed to find organizations'));
    req.organizations = organizations;
    next();
  });
};

/**
 * Create organization
 */

exports.create = function (req, res, next) {
  var data = req.body.organization || req.body;
  var organization = new Organization(data);
  if (!organization) return next(utils.error(500, 'Failed to create organization'));
  req.organization = organization;
  return next();
};

/**
 * Set organization's owner
 */

exports.setOwner = function (req, res, next) {
  if (!req.organization) return next(utils.error(400, 'Organization can\'t be null'));
  req.organization.setOwner(req.user);
  req.organization.save(function (err) {
    if (err) return next(err);
    return next();
  });
};

/**
 *  Show organization
 */

exports.showOne = function (req, res, next) {
  var organization = req.organization || req.organizations[0];
  if (!organization) return next(utils.error(400, 'Organization can\'t be null'));
  res.status(200).json(organization);
};

/**
 *  Show all organizations
 */

exports.showAll = function (req, res) {
  if (!req.organizations) return next(utils.error(400, 'Organizations can\'t be null'));
  res.status(200).json(req.organizations);
};
