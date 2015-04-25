
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var utils = require('../lib/utils');
var idValidator = require('mongoose-id-validator');

var Schema = mongoose.Schema;

var Organization = mongoose.model('Organization');

/**
 * User Schema
 */

var UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  username: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  joinedAt  : { type : Date, default : Date.now },
  organization: {
    id: { type: Schema.ObjectId, ref: 'Organization' },
    role: { type: String, default: '' }
  },

  isSystemAdmin: { type: Boolean, default: false }
});

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

// the below 5 validations only apply if you are signing up traditionally

UserSchema.path('name').validate(function (name) {
  return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function (email) {
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User');

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.count({ email: email }).exec(function (err, count) {
      fn(!err && count === 0);
    });
  } else fn(true);
}, 'Email already exists');

UserSchema.path('username').validate(function (username) {
  return username.length;
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate(function (hashed_password) {
  return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password)) {
    next(utils.error(500, 'Invalid password'));
  } else {
    next();
  }
})

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  /**
   * SetOrganization - set the organization
   *
   * @param {Organization} organization
   * @api public
   */

  setOrganization: function (organization, role) {
    this.organization = {
      id: organization._id,
      role: role
    };
  },

  /**
   * IsOrganization - Check if the organization is the user's organization
   *
   * @param {Organization} organization
   * return {Boolean}
   * @api public
   */

  isOrganization: function (organization) {
    return (this.organization.id === organization._id);
  }
};

/**
 * Statics
 */

UserSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options, cb) {
    options.select = options.select || 'name username';
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
    options.select = options.select || 'name username createdAt';
    options.criteria = options.criteria || {};

    if (!utils.validateCriteria(options.criteria)) return cb(utils.error(400, 'Invalid id'), null);

    this.find(options.criteria)
      .select(options.select)
      .exec(cb);
  }
}

UserSchema.plugin(idValidator);
mongoose.model('User', UserSchema);
