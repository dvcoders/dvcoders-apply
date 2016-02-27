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
      addToGithub(githubUsername, (err, statusCode) => {
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
          ajaxResponse.errorMessage = 'Github username error'
          return res.status(500).json(ajaxResponse)
        }
      })
    }
  }, (req, res, next) => {
    // Databse actions w/ Mongoose
    let body = req.body
    logger.info(`Request body ${JSON.stringify(body)}`)

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
        next()
      }
    }).then((user) => {
      // Successful save and invitation
      logger.info('Successfully saved new user')
      next() // Move to addToSlack
    }, (err) => {
      logger.error(err)
      ajaxResponse.success = false
      ajaxResponse.errorMessage = Object.keys(err.errors).map((key) => err.errors[key].message).join(', ')
      return res.status(500).json(ajaxResponse)
    })
  }, (req, res, next) => {
    // Slack actions
    addToSlack(req.body.email, (err, statusCode, invited) => {
      ajaxResponse.slackSuccess = !err && statusCode === 200
      ajaxResponse.slackInvited = invited
      return res.status(statusCode).json(ajaxResponse)
    })
  })

  let addToGithub = (githubUsername, cb) => {
    // sends and invite to the passed username to join the "developer" team
    // (error, statusCode) is passed to callback function
    let options = {
      hostname: 'api.github.com',
      // Make sure that GITHUB_API_KEY is set before running server
      // 1679886
      path: `/teams/${config.development ? config.github.dev.teamId : config.github.teamId}/memberships/${githubUsername}?access_token=${config.github.apiKey}`,
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
      token: (config.development ? config.slack.dev.token : config.slack.token),
      set_active: true
    })

    let options = {
      hostname: `${config.development ? config.slack.dev.team : config.slack.team}.slack.com`,
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
        logger.info('Slack response:', resBody)
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
