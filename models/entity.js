
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var utils = require('../lib/utils');

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

EntitySchema.path('organization').validate(function (organization) {
  return validatePresenceOf(organization);
}, 'Organization cannot be null');


/**
 * Pre-save hook
 */

EntitySchema.pre('save', function(next) {

  if (!this.isNew) return next();

  if (!validatePresenceOf(this.name)) {
    return next(utils.error(400, 'Invalid name'));
  }

  Organization.exists(this.organization, function(err, exists) {
    return exists ? next() : next(utils.error(400, 'Organization does not exist'));
  });
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

mongoose.model('Entity', EntitySchema);
