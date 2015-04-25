
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var utils = require('../lib/utils');
var idValidator = require('mongoose-id-validator');

var Schema = mongoose.Schema;

/**
 * EntityType Schema
 */

var EntityTypeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  organization: {
    type: Schema.ObjectId,
    ref: 'Organization',
    required: true
  },
  roles: [
    {
      name: {
        type: String,
        required: true
      },
      help: {
        type: String
      },
      mandatory: {
        type: Boolean,
        default: false
      }
    }
  ],
  attributes: [
    {
      name: {
        type: String,
        required: true
      },
      help: {
        type: String
      },
      mandatory: {
        type: Boolean,
        default: false
      }
    }
  ],
  createdAt  : {
    type : Date,
    default : Date.now
  }
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

EntityTypeSchema.path('name').validate(function (name, fn) {
  var EntityType = mongoose.model('EntityType');

  // Check only when it is a new entityType or when name field is modified
  if (this.isNew || this.isModified('name')) {
    EntityType.count({ name: name }).exec(function (err, count) {
      fn(!err && count === 0);
    });
  } else fn(true);
}, 'Name already exists');


/**
 * Pre-save hook
 */

 var rolesError = function(entityType) {
  var err = null;
  var roles = [];
  entityType.roles.forEach(function (role) {
    if (roles.indexOf(role.name) === -1) {
      roles.push(role.name);
    } else {
      err = 'Duplicate role name \'' + role.name + '\'';
      return; // break loop
    }
  });
  return err;
 };

 var attributesError = function(entityType) {
  var err = null;
  var attributes = [];
  entityType.attributes.forEach(function (attribute) {
    if (attributes.indexOf(attribute.name) === -1) {
      attributes.push(attribute.name);
    } else {
      err = 'Duplicate attribute name \'' + attribute.name + '\'';
      return; // break loop
    }
  });
  return err;
 };

EntityTypeSchema.pre('save', function(next) {

  if (!this.isNew) return next();

  if (!validatePresenceOf(this.name)) {
    return next(utils.error(400, 'Invalid name'));
  }

  var err = rolesError(this) || attributesError(this);
  if (err) return next(utils.error(400, err));

  next();
});

/**
 * Methods
 */

EntityTypeSchema.methods = {
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

EntityTypeSchema.plugin(idValidator);
mongoose.model('EntityType', EntityTypeSchema);
