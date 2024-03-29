
/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 * @api public
 */

exports.errors = function (errors) {
  if (!errors) return;

  var keys = Object.keys(errors)
  var errs = []

  // if there is no validation error, just display a generic error
  if (!keys) {
    return ['Oops! There was an error']
  }

  keys.forEach(function (key) {
    if (errors[key]) errs.push(errors[key].message)
  })

  return errs
}

/**
 * Index of object within an array
 *
 * @param {Array} arr
 * @param {Object} obj
 * @return {Number}
 * @api public
 */

exports.indexof = function (arr, obj) {
  var index = -1; // not found initially
  var keys = Object.keys(obj);
  // filter the collection with the given criterias
  var result = arr.filter(function (doc, idx) {
    // keep a counter of matched key/value pairs
    var matched = 0;

    // loop over criteria
    for (var i = keys.length - 1; i >= 0; i--) {
      if (doc[keys[i]] === obj[keys[i]]) {
        matched++;

        // check if all the criterias are matched
        if (matched === keys.length) {
          index = idx;
          return idx;
        }
      }
    };
  });
  return index;
}

/**
 * Find object in an array of objects that matches a condition
 *
 * @param {Array} arr
 * @param {Object} obj
 * @param {Function} cb - optional
 * @return {Object}
 * @api public
 */

exports.findByParam = function (arr, obj, cb) {
  var index = exports.indexof(arr, obj)
  if (~index && typeof cb === 'function') {
    return cb(undefined, arr[index])
  } else if (~index && !cb) {
    return arr[index]
  } else if (!~index && typeof cb === 'function') {
    return cb('not found')
  }
  // else undefined is returned
}

/**
 * Return true if objectId is a valid Mongoose.Types.ObjectId
 *
 * @param {Object} objectId
 * @return {Boolean}
 * @api public
 */

exports.validateObjectId = function(objectId) {
  return objectId.match(/^[0-9a-fA-F]{24}$/);
}

/**
 * Return true if all id filed are valid
 *
 * @param {Object} criteria
 * @return {Boolean}
 * @api public
 */

exports.validateCriteria = function(criteria) {
  var isValid = true;
  if (criteria.id) isValid = isValid && exports.validateObjectId(criteria.id);
  if (criteria._id) isValid = isValid && exports.validateObjectId(criteria._id);
  return isValid;
}

/**
 * Create error with error code
 *
 * @param {Number} code
 * @param {String} message
 * @return {Error}
 * @api public
 */

exports.error = function(code, message) {
  var error = new Error(message);
  error.code = code;
  return error;
}
