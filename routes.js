'use strict'

let mongoose = require('mongoose')
let User = mongoose.model('User')
let Survey = mongoose.model('Survey')

module.exports = (app, logger) => {
  // The main page
  app.get('/', (req, res) => {
    res.render('index.html', {
      'title': 'Join',
      'css': ['css/normalize.css', 'css/skeleton.css', 'css/style.css']
    })
  })

  // The success page
  app.get('/success', (req, res) => {
    res.render('success.html', {
      'title': 'Success',
      'css': []
    })
  })

  // The form API call
  app.post('/join', (req, res) => {
    let body = req.body
    console.log(body)

    User.count({
      email: body.email
    }).exec().then(count => {
      if (count > 0) {
        return res.send('Email already in system')
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
          res.send('Nice forms bro')
        })
      })
    })
  })
}
