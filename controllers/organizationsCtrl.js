
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../lib/utils');

// Models
var Organization = mongoose.model('Organization');
var User = mongoose.model('User');

/**
 * Load
 */

exports.load = function (req, res, next) {
  var organizationId = req.user.organization.id || req.params.organizationId;
  if (!organizationId) return next(new Error('OrganizationId can\'t be null'));
  var options = {
    criteria: { _id : organizationId }
  };
  Organization.load(options, function (err, organization) {
    if (err) return next(err);
    if (!organization) return next(new Error('Failed to load Organization ' + organizationId));
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
    console.log(organizations);
    if (err) return next(err);
    if (!organizations) return next(new Error('Failed to find organizations'));
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
  if (!organization) return next(new Error('Failed to create organization'));
  req.organization = organization;
  return next();
};

/**
 * Set organization's owner
 */

exports.setOwner = function (req, res, next) {
  if (!req.organization) return next(new Error('Organization can\'t be null'));
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
  if (!req.organization) return next(new Error('Organization can\'t be null'));
  res.status(200).json(req.organization);
};

/**
 *  Show all organizations
 */

exports.showAll = function (req, res) {
  if (!req.organizations) return next(new Error('Organizations can\'t be null'));
  res.status(200).json(req.organizations);
};
