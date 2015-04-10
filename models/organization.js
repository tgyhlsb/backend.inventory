
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

/**
 * Organization Schema
 */

var OrganizationSchema = new Schema({
  name: { type: String, default: '' },
  owner: { type: Schema.ObjectId, ref: 'User' },
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

OrganizationSchema.path('name').validate(function (name) {
  return validatePresenceOf(name);
}, 'Name cannot be blank');

OrganizationSchema.path('owner').validate(function (owner) {
  return validatePresenceOf(name);
}, 'Owner cannot be null');


/**
 * Pre-save hook
 */

OrganizationSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.name)) {
    next(new Error('Invalid name'));
  } else if (!validatePresenceOf(this.owner)) {
    next(new Error('Invalid owner'));
  } else {
    next();
  }
});

/**
 * Methods
 */

OrganizationSchema.methods = {
};

/**
 * Statics
 */

OrganizationSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options, cb) {
    options.select = options.select || 'name';
    this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  }
}

mongoose.model('Organization', OrganizationSchema);
