'use strict'

let https = require('https')
let config = require('./config.js')
let mongoose = require('mongoose')
let User = mongoose.model('User')
let Survey = mongoose.model('Survey')

let ajaxResponse = {
  'success': '',
  'emailValid': '',
  'githubValid': '',
  'errorMessage': ''
}

module.exports = (app, logger) => {
  // The main page
  app.get('/', (req, res) => {
    res.render('index.html', {
      'title': 'Join',
      'css': ['css/normalize.css', 'css/skeleton.css', 'css/style.css'],
      'javascripts': ['javascripts/jquery-1.12.0.min.js', 'javascripts/index.js']
    })
  })

  // The form API call
  app.post('/join', (req, res, next) => {

    // Github actions
    let githubUsername = req.body.githubUsername
    addToTeam(githubUsername, (err, statusCode) => {

      if (err) {
        console.log(err)
        res.status(500).end()
      } else if (statusCode === 404) {
        res.status(404).end()
      } else if (statusCode === 200) {
        next()
      } else {
        // if api sends back anything other than 200 or 404, something
        // must be wrong with our server or github's api
        res.status(500).end()
      }
    })
  }, (req, res, next) => {

    // Mongoose actions
    let body = req.body
    logger.info(`Request body ${body}`)
    User.count({
      email: body.email
    }).exec().then(count => {
      if (count > 0) {
        logger.error('Email already in system')
        ajaxResponse.success = false
        ajaxResponse.emailValid = false
        ajaxResponse.errorMessage = 'Email already registered'
        return res.json(ajaxResponse)
      }

      // Create and save Survey first b/c User depends on it
      new Survey({
        'experience': body.experience,
        'interests': body.interests,
        'more-interests': body['more-interests'],
        'projects': body.projects,
        'more-projects': body['more-projects'],
        'events': body.events,
        'more-events': body['more-events']
      }).save().then(survey => {
        new User({
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          mailchimp: !!body.mailchimp,
          description: survey
        }).save().then(user => {
          console.log(user)
          ajaxResponse.success = true
          ajaxResponse.emailValid = true
          res.json(ajaxResponse)
        })
      })
    })

  function addToTeam (githubUsername, cb) {
    // sends and invite to the passed username to join the "developer" team
    // (error, statusCode) is passed to callback function
    let options = {
      hostname: 'api.github.com',
      // Use environment variable to store api key as recommended by github
      // Run `export githubApiKey=key` before running nodemon
      path: `/teams/1679886/memberships/${githubUsername}?access_token=${config.github.apiKey}`,
      method: 'PUT',
      headers: {
        'User-Agent': config.github.userAgent
      }
    }

    let req = https.request(options, (res) => {
      cb(null, res.statusCode)
    })
    req.end()
    req.on('error', (e) => {
      // request ended with an error (github or us, doens't matter) internal server error
      cb(e, 500)
    })
  }
}
