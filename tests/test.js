/*globals describe, it*/
var app = require('./app.js').app
var request = require('supertest')(app)

describe('loading express', function () {
  it('GET /', function testSlash (done) {
    request.get('/').expect(200, done)
  })
  it('404 test', function testPath (done) {
    request.get('/foo/bar').expect(404, done)
  })
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
})
