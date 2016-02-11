'use strict'

let https = require('https')
let config = require('./config.js')

module.exports = (app, logger) => {
  // The main page
  app.get('/', (req, res) => {
    res.render('index.html', {
      'title': 'Join',
      'css': ['css/normalize.css', 'css/skeleton.css', 'css/style.css'],
      'javascripts': ['javascripts/jquery-1.12.0.min.js', 'javascripts/index.js']
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
  app.post('/join', (req, res, next) => {
    let githubUsername = req.body.githubUsername

    if (githubUsername === '') {
      next()
    }

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
    // mongoose additions can go here
    res.send('Nice forms bro')
  })

  function addToTeam (githubUsername, cb) {
    // sends and invite to the passed username to join the "developer" team
    // (error, statusCode) is passed to callback function
    let options = {
      hostname: 'api.github.com',
      // use environment variable to store api key as recommended by github
      // run `export githubApiKey=key` before running nodemon
      path: '/teams/1679886/memberships/' + githubUsername + '?access_token=' + config.github.apiKey,
      method: 'PUT',
      headers: {
        'User-Agent': config.github.userAgent
      }
    }

    let req = https.request(options, (res) => {
      cb(null, res.statusCode)
    })
    console.log(options)
    req.end()
    req.on('error', (e) => {
      cb('error : ' + e)
    })
  }
}
