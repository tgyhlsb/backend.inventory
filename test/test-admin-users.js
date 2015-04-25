
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
  describe('POST /root/users', function () {
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

      /**
       * No email
       */

      it('no email - should respond with errors', function (done) {
        request(app)
        .post('/root/users/')
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

      /**
       * No username
       */

      it('no username - should respond with errors', function (done) {
        request(app)
        .post('/root/users/')
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Basic YWRtaW5AdGVzdC5jb206YWRtaW4='
        })
        .send({
          name: 'Bob1',
          email: 'bob1@test.com',
          password: 'bob1'
        })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(helper.error(400, 'User validation failed'))
        .end(done)
      })

      /**
       * No name
       */

      it('no name - should respond with errors', function (done) {
        request(app)
        .post('/root/users/')
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Basic YWRtaW5AdGVzdC5jb206YWRtaW4='
        })
        .send({
          username: 'bob2',
          email: 'bob2@test.com',
          password: 'bob2'
        })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(helper.error(400, 'User validation failed'))
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

      /**
       * Respond with user info
       */

      it('Respond with new user info', function (done) {
        request(app)
        .post('/root/users/')
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Basic YWRtaW5AdGVzdC5jb206YWRtaW4='
        })
        .send({
          name: 'Bob 3',
          username: 'bob3',
          email: 'bob3@test.com',
          password: 'bob3'
        })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(helper.json({
          username: 'bob3',
          email: 'bob3@test.com',
          name: 'Bob 3'
        }))
        .end(done)
      })

      it('should insert a record to the database', function (done) {
        User.count(function (err, cnt) {
          cnt.should.equal(count + 1)
          done()
        })
      })

      it('should save the user to the database', function (done) {
        User.findOne({ username: 'bob3' }).exec(function (err, user) {
          should.not.exist(err)
          user.should.be.an.instanceOf(User)
          user.email.should.equal('bob3@test.com')
          done()
        })
      })
    })
  })

  after(function (done) {
    helper.clearDb(done)
  })
})
