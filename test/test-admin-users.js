
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../app')
  , helper = require('./helper')
  , context = describe
  , User = mongoose.model('User')

var cookies, count

/**
 * Users tests
 */

describe('Users', function () {
  describe('POST /users', function () {
    describe('Invalid parameters', function () {
      before(function (done) {
        var user = new User({
          name: "Admin",
          email: "admin@test.com",
          username: "admin",
          password: "admin",
          isSystemAdmin: true
        });

        user.save(function (err) {
          done();
        });
      })

      before(function (done) {
        User.count(function (err, cnt) {
          count = cnt
          done()
        })
      })

      it('no email - should respond with errors', function (done) {
        request(app)
        .post('/users/')
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Basic YWRtaW5AdGVzdC5jb206YWRtaW4='
        })
        .send({
          name: 'Bob',
          username: 'bob',
          password: 'bob'
        })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(helper.error(400, 'User validation failed'))
        .end(done)
      })

      it('no name - should respond with errors', function (done) {
        request(app)
        .post('/users')
        .field('name', '')
        .field('username', 'foobar')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/Name cannot be blank/)
        .end(done)
      })

      it('should not save the user to the database', function (done) {
        User.count(function (err, cnt) {
          count.should.equal(cnt)
          done()
        })
      })
    })

    describe('Valid parameters', function () {
      before(function (done) {
        User.count(function (err, cnt) {
          count = cnt
          done()
        })
      })

      it('should redirect to /articles', function (done) {
        request(app)
        .post('/users')
        .field('name', 'Foo bar')
        .field('username', 'foobar')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .expect('Content-Type', /plain/)
        .expect('Location', /\//)
        .expect(302)
        .expect(/Moved Temporarily/)
        .end(done)
      })

      it('should insert a record to the database', function (done) {
        User.count(function (err, cnt) {
          cnt.should.equal(count + 1)
          done()
        })
      })

      it('should save the user to the database', function (done) {
        User.findOne({ username: 'foobar' }).exec(function (err, user) {
          should.not.exist(err)
          user.should.be.an.instanceOf(User)
          user.email.should.equal('foobar@example.com')
          done()
        })
      })
    })
  })

  after(function (done) {
    helper.clearDb(done)
  })
})
