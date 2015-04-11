
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Organization = mongoose.model('Organization');
var User = mongoose.model('User');
var utils = require('../lib/utils');

/**
 * Load
 */

exports.load = function (req, res, next) {
  var organizationId = req.user.organization || req.params.organizationId;
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
 * Create organization
 */

exports.create = function (req, res) {
  var organization = new Organization(req.body);
  organization.setOwner(req.user);
  organization.save(function (err) {
    if (err) {
      return err;
    } else {
      req.user.setOrganization(organization);
      req.user.save(function (err) {
        if (err) {
          return err;
        } else {
          res.json({
            organization: organization,
            user: req.user
          });
        }
      });
    }
  });
};

/**
 *  Show organization
 */

exports.showOne = function (req, res) {
  var organization = req.organization;
  if (organization) {
    res.status(200).json(organization);
  } else {
    res.status(404).send('Organization not found');
  }
};

/**
 *  Show all organizations
 */

exports.showAll = function (req, res) {
  res.json(['un', 'deux']);
};
