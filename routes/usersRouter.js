var express = require('express');
var router = express.Router();

// Controllers
var usersCtrl = require('usersCtrl');

/* GET usersCtrl listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', usersCtrl.login);
router.get('/signup', usersCtrl.signup);

router
.post('/',
  // passport.authenticate('basic', { session: false }),
  usersCtrl.create,
  usersCtrl.showOne
  );


module.exports = router;
