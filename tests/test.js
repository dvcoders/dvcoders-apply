/*globals describe, it*/
var app = require('./app.js').app
var request = require('supertest')(app)

describe('loading express', function () {
  it('should return on GET /', function testSlash (done) {
    request.get('/').expect(200, done)
  })
  it('should return on unkown /foo/bar', function testPath (done) {
    request.get('/foo/bar').expect(404, done)
  })
  /*
   * This test requires better refactoring of the main application.
   * Several components in routes.js need to be reconsidered and improved.
   * As a result, this test will be temporarily removed while improvements
   * are being made.
  it('post to /join', function testJoin (done) {
    request
      .post('/join')
      .send({
        'firstName': 'John',
        'lastName': 'Smith',
        'email': 'fjaiower@boier.com',
        'mailchimp': 'on',
        'githubUsername': '', // TODO: test addToTeam()
        'more-interests': '',
        'more-projects': '',
        'more-events': ''
      })
      .expect(200, done)
  })
  */
})
