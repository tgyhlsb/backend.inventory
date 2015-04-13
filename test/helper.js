
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , User = mongoose.model('User')

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

exports.clearDb = function (done) {
  async.parallel([
    function (cb) {
      User.collection.remove(cb)
    }
  ], done)
}

/**
 * Generate error json
 *
 * @param {Number} code
 * @param {String} message
 * @return {Function}
 * @api public
 */

exports.error = function (code, message) {
  return function (res) {
    if (res.status !== code) throw new Error('Invalid response status');
    if (!res.body) throw new Error('Invalid body response');
    if (res.body.status !== code) throw new Error('Invalid error status');
    if (res.body.message !== message) throw new Error('Invalid error message');
  };
}

/**
 * Generate res json
 *
 * @param {Object} json
 * @return {Function}
 * @api public
 */

exports.json = function (json) {
  return function (res) {
    Object.keys(json).forEach(function (key) {
      if (json[key] !== res.body[key]) throw new Error('Invalid value for key ' + key);
    })
  };
}
