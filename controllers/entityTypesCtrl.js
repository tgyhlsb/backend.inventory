
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../lib/utils');

// Models
var Organization = mongoose.model('Organization');
var User = mongoose.model('User');
var EntityType = mongoose.model('EntityType');

/**
 * Select - select which entityType to load
 */

exports.select = function (req, res, next) {
  req.body.criteria = {
    _id: req.params.entityTypeId
  };
  return next();
};

/**
 * Load - load user's organization
 */

// exports.load = function (req, res, next) {
//   var organizationId = req.user.organization.id;
//   if (!organizationId) return next(utils.error(400, 'OrganizationId not set'));
//   var options = {
//     criteria: { _id : organizationId }
//   };
//   Organization.load(options, function (err, organization) {
//     if (err) return next(err);
//     if (!organization) return next(utils.error(500, 'Failed to load Organization ' + organizationId));
//     req.organization = organization;
//     next();
//   });
// };

/**
 * Fetch
 */

exports.fetch = function (req, res, next) {
  var options = req.body;
  EntityType.fetch(options, function (err, entityTypes) {
    if (err) return next(err);
    if (!entityTypes) return next(utils.error(500, 'Failed to find entityTypes'));
    req.entityTypes = entityTypes;
    next();
  });
};

/**
 * Create
 */

exports.create = function (req, res, next) {
  var data = req.body.entityType || req.body;
  var entityType = new EntityType(data);
  if (!entityType) return next(utils.error(500, 'Failed to create EntityType'));

  entityType.save(function (err) {
    if (err) return next(err);
    req.entityType = entityType;
    return next();
  });
};

/**
 * Set organization's owner
 */

// exports.setOwner = function (req, res, next) {
//   if (!req.organization) return next(utils.error(400, 'Organization can\'t be null'));
//   req.organization.setOwner(req.user);
//   req.organization.save(function (err) {
//     if (err) return next(err);
//     return next();
//   });
// };

/**
 *  Show entityType
 */

exports.showOne = function (req, res, next) {
  var entityType = req.entityType || req.entityTypes[0];
  if (!entityType) return next(utils.error(400, 'EntityType can\'t be null'));
  res.status(200).json(entityType);
};

/**
 *  Show all entityTypes
 */

exports.showAll = function (req, res) {
  if (!req.entityTypes) return next(utils.error(400, 'EntityTypes can\'t be null'));
  res.status(200).json(req.entityTypes);
};
