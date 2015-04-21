
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var utils = require('../lib/utils');

var Schema = mongoose.Schema;

/**
 * EntityType Schema
 */

var EntityTypeSchema = new Schema({
  name: { type: String, default: 'New EntityType' },
  organization: { type: Schema.ObjectId, ref: 'Organization' },
  createdAt  : { type : Date, default : Date.now }
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

EntityTypeSchema.path('name').validate(function (name) {
  return validatePresenceOf(name);
}, 'Name cannot be blank');

EntityTypeSchema.path('organization').validate(function (organization) {
  return validatePresenceOf(organization);
}, 'Organization cannot be null');


/**
 * Pre-save hook
 */

EntityTypeSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.name)) {
    next(utils.error(500, 'Invalid name'));
  } else {
    next();
  }
});

/**
 * Methods
 */

EntityTypeSchema.methods = {

  /**
   * SetOwner - set the owner
   *
   * @param {UserSchema} owner
   * @api public
   */

  setOwner: function (owner) {
    this.owner = owner._id;
  },

  /**
   * IsOwner - Check if the user is the EntityType's owner
   *
   * @param {UserSchema} user
   * return {Boolean}
   * @api public
   */

  isOwner: function (user) {
    return (this.owner === user._id);
  }
};

/**
 * Statics
 */

EntityTypeSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options, cb) {
    options.select = options.select || 'name organization createdAt';
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
    options.select = options.select || 'name organization createdAt';
    options.criteria = options.criteria || {};

    if (!utils.validateCriteria(options.criteria)) return cb(utils.error(400, 'Invalid id'), null);

    this.find(options.criteria)
      .select(options.select)
      .exec(cb);
  }
}

mongoose.model('EntityType', EntityTypeSchema);
