'use strict'

let https = require('https')
let config = require('./config.js')
let mongoose = require('mongoose')
let querystring = require('querystring')
let User = mongoose.model('User')
let Survey = mongoose.model('Survey')

mongoose.Promise = require('bluebird')

let ajaxResponse = JSON.stringify({
  'success': true,
  'emailValid': true,
  'githubValid': true,
  'errorMessage': ''
})

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
    logger.info(`Request body ${JSON.stringify(req.body)}`)
    let response = JSON.parse(ajaxResponse) // Get a copy
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
          response.success = false
          response.githubValid = false
          response.errorMessage = 'Github username could not be found'
          logger.info(response.errorMessage)
          return res.status(400).json(response)
        } else if (statusCode === 200) {
          logger.info('Successfully invited user to GitHub')
          next() // Move to saving in Mongo
        } else {
          // if api sends back anything other than 200 or 404, something must be wrong with our server or Github's API
          logger.error(`Github API responded with ${statusCode}`)
          response.success = false
          response.githubValid = false
          response.errorMessage = 'Github username error'
          return res.status(500).json(response)
        }
      })
    }
  }, (req, res, next) => {
    // Databse actions w/ Mongoose
    let response = JSON.parse(ajaxResponse) // Get a copy
    let body = req.body

    let userObj = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      mailchimp: !!body.mailchimp, // Convert to boolean if not already
      github: body.githubUsername
    }

    // Search for the user email.
    // Email exists? Update
    // Email original? Create new using upsert
    User.findOneAndUpdate({email: userObj.email}, userObj, {upsert: true, new: true}).exec().then((user) => {
      if (!user.submittedSurvey) {
        return new Survey({
          'experience': body.experience,
          'interests': body.interests,
          'more-interests': body['more-interests'],
          'projects': body.projects,
          'more-projects': body['more-projects'],
          'events': body.events,
          'more-events': body['more-events']
        }).save().then((survey) => {
          user.description = survey
          user.submittedSurvey = true
          return user.save()
        })
      } else {
        logger.info('Updated exisitng user')
      }
    }).then((user) => {
      // Successful save and invitation
      logger.info('Successfully saved user')
      next() // Move to addToSlack
    }, (err) => {
      logger.error(err)
      response.success = false
      response.errorMessage = Object.keys(err.errors).map((key) => err.errors[key].message).join(', ')
      return res.status(500).json(response)
    })
  }, (req, res, next) => {
    // Slack actions
    let response = JSON.parse(ajaxResponse) // Get a copy
    addToSlack(req.body.email, (err, statusCode, invited) => {
      response.slackSuccess = !err && statusCode === 200
      response.slackInvited = invited
      return res.status(statusCode).json(response)
    })
  })

  let addToTeam = (githubUsername, cb) => {
    // sends and invite to the passed username to join the "developer" team
    // (error, statusCode) is passed to callback function
    let options = {
      hostname: 'api.github.com',
      // Make sure that GITHUB_API_KEY is set before running server
      path: `/teams/1679886/memberships/${githubUsername}?access_token=${config.github.apiKey}`,
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
        logger.info('Slack response:', res.statusCode, resBody)
        if (res.statusCode === 200 && !resBody.ok && (resBody.error === 'already_invited' || resBody.error === 'already_in_team')) {
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
