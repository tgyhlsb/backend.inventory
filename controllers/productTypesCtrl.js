
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../lib/utils');

// Models
var Organization = mongoose.model('Organization');
var User = mongoose.model('User');
var ProductType = mongoose.model('ProductType');

/**
 * Select - select which productType to load
 */

exports.select = function (req, res, next) {
  req.body.criteria = {
    _id: req.params.productTypeId
  };
  return next();
};

/**
 * Fetch
 */

exports.fetch = function (req, res, next) {
  var options = req.body;
  ProductType.fetch(options, function (err, productTypes) {
    if (err) return next(err);
    if (!productTypes) return next(utils.error(500, 'Failed to find productTypes'));
    req.productTypes = productTypes;
    next();
  });
};

/**
 * Create
 */

exports.create = function (req, res, next) {
  var data = req.body.productType || req.body;
  var productType = new ProductType(data);
  if (!productType) return next(utils.error(500, 'Failed to create productType'));
  productType.save(function (err) {
    if (err) return next(err);
    req.productType = productType;
    return next();
  });
};

/**
 *  Show productType
 */

exports.showOne = function (req, res, next) {
  var productType = req.productType || req.productTypes[0];
  if (!productType) return next(utils.error(400, 'productType can\'t be null'));
  res.status(200).json(productType);
};

/**
 *  Show all productTypes
 */

exports.showAll = function (req, res) {
  if (!req.productTypes) return next(utils.error(400, 'productTypes can\'t be null'));
  res.status(200).json(req.productTypes);
};
