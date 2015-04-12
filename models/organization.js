
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
  name: { type: String, default: 'New Organization' },
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
  return validatePresenceOf(owner);
}, 'Owner cannot be null');


/**
 * Pre-save hook
 */

OrganizationSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.name)) {
    next(new Error('Invalid name'));
  } else {
    next();
  }
});

/**
 * Methods
 */

OrganizationSchema.methods = {

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
   * IsOwner - Check if the user is the organization's owner
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

OrganizationSchema.statics = {

  roleAdmin: 'admin',

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
