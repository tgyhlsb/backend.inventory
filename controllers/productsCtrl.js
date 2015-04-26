
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../lib/utils');

// Models
var Organization = mongoose.model('Organization');
var User = mongoose.model('User');
var ProductType = mongoose.model('ProductType');
var Product = mongoose.model('Product');

/**
 * Select - select which product to load
 */

exports.select = function (req, res, next) {
  req.body.criteria = {
    _id: req.params.productId
  };
  return next();
};

/**
 * Fetch
 */

exports.fetch = function (req, res, next) {
  var options = req.body;
  Product.fetch(options, function (err, entities) {
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
  var data = req.body.product || req.body;
  var product = new Product(data);
  if (!product) return next(utils.error(500, 'Failed to create product'));
  product.save(function (err) {
    if (err) return next(err);
    req.product = product;
    return next();
  });
};

/**
 *  Show product
 */

exports.showOne = function (req, res, next) {
  var product = req.product || req.entities[0];
  if (!product) return next(utils.error(400, 'product can\'t be null'));
  res.status(200).json(product);
};

/**
 *  Show all entities
 */

exports.showAll = function (req, res) {
  if (!req.entities) return next(utils.error(400, 'Entities can\'t be null'));
  res.status(200).json(req.entities);
};
