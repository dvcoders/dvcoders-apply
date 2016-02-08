'use strict'

let express = require('express')
let bodyParser = require('body-parser')
let nunjucks = require('nunjucks')
let app = express()
let config = require('./config.js')
let utils = require('./utils.js')
let db = require('./database')

db(err => {
  if (err) {
    return console.error('connection error:', err)
  }

  console.log('Connected to MongoDB!')
})

// Set the server's port
app.set('port', process.env.PORT || config.server.port || 3000)

// Allow templates to access config.client settings
app.locals.app = config.client

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ 'extended': true }))

// Create the logging utility
let logger = require('./logger.js')()

// Pass express data through the logger
app.use(require('morgan')('dev', {
  'stream': {
    'write': (message, encoding) => { logger.info(message) }
  }
}))

// Set express to use the nunjucks engine,
// and configure nunjucks
nunjucks.configure('views', {
  'autoescape': true,
  'express': app
})

// Create routing
require('./routes.js')(app, logger)

// Start the server
let server = app.listen(app.get('port'), () => {
  logger.info(`Server running on port ${server.address().port}`)
})
