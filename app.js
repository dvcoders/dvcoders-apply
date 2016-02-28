'use strict'

let express = require('express')
let bodyParser = require('body-parser')
let nunjucks = require('nunjucks')
let app = exports.app = express()
let config = require('./config.js')
let db = require('./database')

// Set the server's port
app.set('port', process.env.PORT || config.server.port || 3000)

// Allow templates to access config.client settings
app.locals.app = config.client

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ 'extended': true }))
app.use(bodyParser.json())

// Create the logging utility
let logger = require('./logger.js')()

// Pass express data through the logger
app.use(require('morgan')('dev', {
  'stream': {
    'write': (message, encoding) => {
      logger.info(message)
    }
  }
}))

// Set express to use the nunjucks engine,
// and configure nunjucks
nunjucks.configure('views', {
  'autoescape': true,
  'express': app
})

if (process.env.NODE_ENV === 'production') {
  if (config.github.apiKey && config.github.userAgent && config.slack.token) {
    logger.info('PRODUCTION: Github API Key, User Agent values set, Slack token set')
  } else {
    logger.error(`One of the following is not set: PRODUCTION Github API Key, User Agent variables, PRODUCTION Slack token.
        Please set the following enviornment variables:
        export GITHUB_API_KEY=key & export GITHUB_USER_AGENT=userAgent & export SLACK_TOKEN=token`)
    process.exit()
  }
} else {
  if (config.github.dev.apiKey && config.github.userAgent && config.slack.dev.token) {
    logger.info('DEVELOPMENT: Github API Key, User Agent values set, Slack token set')
  } else {
    logger.error(`One of the following is not set: DEVELOPMENT Github API Key, User Agent variables, DEVELOPMENT Slack token.
        Please set the following enviornment variables:
        export GITHUB_API_KEY=key & export GITHUB_USER_AGENT=userAgent & export SLACK_TOKEN=token`)
    process.exit()
  }
}

// Connect to MongoDB and start web server on success
db((err) => {
  if (err) {
    return console.error('MongoDB connection error:', err)
  }
  logger.info('Connected to MongoDB!')
  // Create routing after database is connected
  require('./routes.js')(app, logger)

  // Start the server
  let server = app.listen(app.get('port'), () => {
    logger.info(`Server running on port ${server.address().port}`)
  })
})
