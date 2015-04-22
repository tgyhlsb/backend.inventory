
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
 * Fetch duplicates
 */

exports.fetchDuplicates = function (req, res, next) {
  var data = req.body.entityType || req.body;
  var options = {
    criteria: {
      organization: data.organization,
      name: data.name
    }
  };
  EntityType.fetch(options, function (err, entityTypes) {
    if (err) return next(err);
    if (entityTypes && entityTypes.length) {
      return next(utils.error(400, 'EntityType \'' + data.name + '\' already exists'));
    }
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
