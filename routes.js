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
    if (githubUsername === '') {
      next()
    } else {
      addToTeam(res, next, githubUsername, githubResponseHandler)
    }
  }, (req, res, next) => {
    // Mongoose actions
    let body = req.body
    logger.info('Request body:', req.body)

    // Create and save User with Survey
    new User({
      firstName: body.firstName,
      lastName: body.lastName, // '', // Forcing a required error
      email: body.email,
      mailchimp: !!body.mailchimp // Convert to boolean if not already
    }).save().then(user => {
      return new Survey({
        'experience': body.experience,
        'interests': body.interests,
        'more-interests': body['more-interests'],
        'projects': body.projects,
        'more-projects': body['more-projects'],
        'events': body.events,
        'more-events': body['more-events']
      }).save().then(survey => {
        user.description = survey
        return user.save()
      })
    }).then(user => {
      // Successful save and invitation
      logger.info('Successfully invited', user)
      ajaxResponse.success = true
      ajaxResponse.emailValid = true
      res.json(ajaxResponse)
    }, err => {
      console.log(err)
      if (err.code === 11000) {
        logger.error('Duplicated email')
        ajaxResponse.success = false
        ajaxResponse.emailValid = false
        ajaxResponse.errorMessage = 'Email already registered'
        return res.status(400).json(ajaxResponse)
      } else {
        logger.error(err.message)
        ajaxResponse.success = false
        ajaxResponse.errorMessage = Object.keys(err.errors).map(key => err.errors[key].message).join(' ')
        return res.status(500).json(ajaxResponse)
      }
    })
  })

  let githubResponseHandler = (res, next, err, statusCode) => {
    if (err) {
      logger.error(err)
      res.status(500).end()
    } else if (statusCode === 404) {
      // Username could not be found
      ajaxResponse.success = false
      ajaxResponse.githubValid = false
      ajaxResponse.errorMessage = 'Github username could not be found'
      return res.status(400).json(ajaxResponse)
    } else if (statusCode === 200) {
      logger.info('Successfully invited user')
      next()
    } else {
      // if api sends back anything other than 200 or 404, something must be wrong with our server or Github's API
      logger.error(`Github API responded with ${statusCode}`)
      ajaxResponse.success = false
      ajaxResponse.githubValid = false
      ajaxResponse.errorMessage = 'Internal server error'
      return res.status(500).json(ajaxResponse)
    }
  }

  let addToTeam = (res, next, githubUsername, cb) => {
    // sends and invite to the passed username to join the "developer" team
    // (error, statusCode) is passed to callback function
    let options = {
      hostname: 'api.github.com',
      // Make sure that GITHUB_API_KEY is set before running server
      path: `/teams/1679886/meqmberships/${githubUsername}?access_token=${config.github.apiKey}`,
      method: 'PUT',
      headers: {
        'User-Agent': config.github.userAgent
      }
    }

    let ghReq = https.request(options, (ghRes) => {
      cb(res, next, null, ghRes.statusCode)
    })
    ghReq.end()
    ghReq.on('error', (e) => {
      logger.error(`Github request error: ${e}`)
      cb(res, next, e, 500)
    })
  }
}
