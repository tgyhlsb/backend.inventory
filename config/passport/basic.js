
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var BasicStrategy = require('passport-http').BasicStrategy;
var config = require('config');
var User = mongoose.model('User');

/**
 * Expose
 */

module.exports = new BasicStrategy(
  function(email, password, done) {
    console.log('email ', email);
    console.log('password ', password);
    var options = {
      criteria: { email: email },
      select: 'name username email hashed_password salt'
    };
    User.load(options, function (err, user) {
      console.log(user);
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' });
      }
      return done(null, user);
    });
  }
);
