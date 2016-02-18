'use strict'

let https = require('https')
let config = require('./config.js')
let mongoose = require('mongoose')
let querystring = require('querystring')
let User = mongoose.model('User')
let Survey = mongoose.model('Survey')

let ajaxResponse = {
  'success': true,
  'emailValid': true,
  'githubValid': true,
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
      addToTeam(githubUsername, (err, statusCode) => {
        if (err) {
          logger.error(err)
          res.status(500).end()
        } else if (statusCode === 404) {
          // Username could not be found
          ajaxResponse.success = false
          ajaxResponse.githubValid = false
          ajaxResponse.errorMessage = 'Github username could not be found'
          logger.info(ajaxResponse.errorMessage)
          return res.status(400).json(ajaxResponse)
        } else if (statusCode === 200) {
          logger.info('Successfully invited user to GitHub')
          next()
        } else {
          // if api sends back anything other than 200 or 404, something must be wrong with our server or Github's API
          logger.error(`Github API responded with ${statusCode}`)
          ajaxResponse.success = false
          ajaxResponse.githubValid = false
          ajaxResponse.errorMessage = 'Internal server error'
          return res.status(500).json(ajaxResponse)
        }
      })
    }
  }, (req, res, next) => {
    // Mongoose actions
    let body = req.body
    logger.info(`Request body ${JSON.stringify(body)}`)

    // Create and save User with Survey
    new User({
      firstName: body.firstName,
      lastName: body.lastName, // '', // Forcing a required error
      email: body.email,
      mailchimp: !!body.mailchimp, // Convert to boolean if not already
      github: body.githubUsername
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
      logger.info('Successfully saved user')
      next()
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
        ajaxResponse.errorMessage = Object.keys(err.errors).map(key => err.errors[key].message).join(', ')
        return res.status(500).json(ajaxResponse)
      }
    })
  }, (req, res, next) => {
    // Slack actions
    addToSlack(req.body.email, (err, statusCode, invited) => {
      ajaxResponse.slackSuccess = !err && statusCode === 200
      ajaxResponse.slackInvited = invited
      return res.status(statusCode).json(ajaxResponse)
    })
  })

  let addToTeam = (githubUsername, cb) => {
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
      cb(null, ghRes.statusCode)
    })
    ghReq.end()
    ghReq.on('error', (e) => {
      logger.error(`Github request error: ${e}`)
      cb(e, 500)
    })
  }

  let addToSlack = (email, cb) => {
    // sends an invite to join the dvcoders slack channel
    // (error, statusCode, invited) is passed to the callback, but note that
    // slack sends a 200 even if the user has already been invited.
    // also not this api endpoint is "undocumented" and subject to change
    let data = querystring.stringify({
      email: email,
      token: config.slack.token,
      set_active: true
    })

    let options = {
      hostname: 'dvcoders.slack.com',
      path: '/api/users.admin.invite',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
      }
    }

    let req = https.request(options, (res) => {
      let body = ''
      res.setEncoding('utf8')
      res.on('data', (d) => {
        body += d
      })
      res.on('end', () => {
        let resBody = JSON.parse(body)
        console.log(resBody)
        if (res.status === 200 && !resBody.ok && (resBody.error === 'already_invited' || resBody.error === 'already_in_team')) {
          cb(null, 200, true)
        } else {
          cb(null, res.statusCode, false)
        }
      })
    })
    req.on('error', (err) => {
      logger.error(`Slack request error: ${err}`)
      cb(err, 500, false)
    })
    req.write(data)
    req.end()
  }
}
