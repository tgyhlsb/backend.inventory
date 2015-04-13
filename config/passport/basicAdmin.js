
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = mongoose.model('User');

/**
 * Expose
 */

module.exports = new BasicStrategy(
  function(email, password, done) {
    var options = {
      criteria: { email: email },
      select: 'name username email hashed_password salt organization isSystemAdmin'
    };
    User.load(options, function (err, user) {
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      if (!user.authenticate(password) && !user.isSystemAdmin) {
        return done(null, false, { message: 'Access denied' });
      }
      return done(null, user);
    });
  }
);
