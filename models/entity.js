
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var utils = require('../lib/utils');
var idValidator = require('mongoose-id-validator');

var Schema = mongoose.Schema;

// Models
var Organization = mongoose.model('Organization');


/**
 * Entity Schema
 */

var EntitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  organization: {
    type: Schema.ObjectId,
    ref: 'Organization',
    required: true
  },
  type: {
    type: Schema.ObjectId,
    ref: 'EntityType',
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

EntitySchema.path('name').validate(function (name) {
  return validatePresenceOf(name);
}, 'Name cannot be blank');

EntitySchema.path('name').validate(function (name, fn) {
  var Entity = mongoose.model('Entity');

  // Check only when it is a new entity or when name field is modified
  if (this.isNew || this.isModified('name')) {
    Entity.count({ name: name }).exec(function (err, count) {
      fn(!err && count === 0);
    });
  } else fn(true);
}, 'Name already exists');


/**
 * Pre-save hook
 */

EntitySchema.pre('save', function(next) {

  if (!this.isNew) return next();

  if (!validatePresenceOf(this.name)) {
    return next(utils.error(400, 'Invalid name'));
  }

  next();
});

/**
 * Methods
 */

EntitySchema.methods = {
};

/**
 * Statics
 */

EntitySchema.statics = {

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

EntitySchema.plugin(idValidator);
mongoose.model('Entity', EntitySchema);
