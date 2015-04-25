
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../lib/utils');

// Models
var Organization = mongoose.model('Organization');
var User = mongoose.model('User');
var EntityType = mongoose.model('EntityType');
var Entity = mongoose.model('Entity');

/**
 * Select - select which entity to load
 */

exports.select = function (req, res, next) {
  req.body.criteria = {
    _id: req.params.entityId
  };
  return next();
};

/**
 * Fetch
 */

exports.fetch = function (req, res, next) {
  var options = req.body;
  Entity.fetch(options, function (err, entities) {
    if (err) return next(err);
    if (!entities) return next(utils.error(500, 'Failed to find entities'));
    req.entities = entities;
    next();
  });
};

/**
 * Create
 */

exports.create = function (req, res, next) {
  var data = req.body.entity || req.body;
  var entity = new Entity(data);
  if (!entity) return next(utils.error(500, 'Failed to create Entity'));
  entity.save(function (err) {
    if (err) return next(err);
    req.entity = entity;
    return next();
  });
};

/**
 *  Show entity
 */

exports.showOne = function (req, res, next) {
  var entity = req.entity || req.entities[0];
  if (!entity) return next(utils.error(400, 'Entity can\'t be null'));
  res.status(200).json(entity);
};

/**
 *  Show all entities
 */

exports.showAll = function (req, res) {
  if (!req.entities) return next(utils.error(400, 'Entities can\'t be null'));
  res.status(200).json(req.entities);
};
