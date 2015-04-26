
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var utils = require('../lib/utils');
var idValidator = require('mongoose-id-validator');

var Schema = mongoose.Schema;

/**
 * Product Schema
 */

var ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  parent: {
    type: Schema.ObjectId,
    ref: 'Product',
    required: false
  },
  organization: {
    type: Schema.ObjectId,
    ref: 'Organization',
    required: true
  },
  type: {
    type: Schema.ObjectId,
    ref: 'ProductType',
    required: true
  },
  createdAt  : {
    type : Date,
    default : Date.now
  },
  roles: {},
  attributes: {}
});

/**
 * Virtuals
 */

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

ProductSchema.path('name').validate(function (name) {
  return validatePresenceOf(name);
}, 'Name cannot be blank');

ProductSchema.path('name').validate(function (name, fn) {
  var Product = mongoose.model('Product');

  // Check only when it is a new Product or when name field is modified
  if (this.isNew || this.isModified('name')) {
    Product.count({ name: name, parent: this.parent }).exec(function (err, count) {
      fn(!err && count === 0);
    });
  } else fn(true);
}, 'Name already exists');


/**
 * Pre-save hook
 */

ProductSchema.pre('save', function(next) {
  next();
});

/**
 * Methods
 */

ProductSchema.methods = {
};

/**
 * Statics
 */

ProductSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options, cb) {
    options.select = options.select || 'name organization roles attributes';
    this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  },

  /**
   * Fetch
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  fetch: function (options, cb) {
    options.select = options.select || 'name organization roles attributes';
    options.criteria = options.criteria || {};

    if (!utils.validateCriteria(options.criteria)) return cb(utils.error(400, 'Invalid id'), null);

    this.find(options.criteria)
      .select(options.select)
      .exec(cb);
  }
}

ProductSchema.plugin(idValidator);
mongoose.model('Product', ProductSchema);
