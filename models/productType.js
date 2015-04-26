
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var utils = require('../lib/utils');
var idValidator = require('mongoose-id-validator');

var Schema = mongoose.Schema;

/**
 * ProductType Schema
 */

var ProductTypeSchema = new Schema({
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

ProductTypeSchema.path('name').validate(function (name) {
  return validatePresenceOf(name);
}, 'Name cannot be blank');

ProductTypeSchema.path('name').validate(function (name, fn) {
  var ProductType = mongoose.model('ProductType');

  // Check only when it is a new ProductType or when name field is modified
  if (this.isNew || this.isModified('name')) {
    ProductType.count({ name: name }).exec(function (err, count) {
      fn(!err && count === 0);
    });
  } else fn(true);
}, 'Name already exists');


/**
 * Pre-save hook
 */

 var rolesError = function(ProductType) {
  var err = null;
  var roles = [];
  ProductType.roles.forEach(function (role) {
    if (roles.indexOf(role.name) === -1) {
      roles.push(role.name);
    } else {
      err = 'Duplicate role name \'' + role.name + '\'';
      return; // break loop
    }
  });
  return err;
 };

 var attributesError = function(ProductType) {
  var err = null;
  var attributes = [];
  ProductType.attributes.forEach(function (attribute) {
    if (attributes.indexOf(attribute.name) === -1) {
      attributes.push(attribute.name);
    } else {
      err = 'Duplicate attribute name \'' + attribute.name + '\'';
      return; // break loop
    }
  });
  return err;
 };

ProductTypeSchema.pre('save', function(next) {

  var err = rolesError(this) || attributesError(this);
  if (err) return next(utils.error(400, err));

  next();
});

/**
 * Methods
 */

ProductTypeSchema.methods = {
};

/**
 * Statics
 */

ProductTypeSchema.statics = {

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

ProductTypeSchema.plugin(idValidator);
mongoose.model('ProductType', ProductTypeSchema);
