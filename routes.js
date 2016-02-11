'use strict'

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
  app.post('/join', (req, res) => {
    let body = req.body
    logger.info(body)

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
  })
}
