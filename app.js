'use strict'

// Exit if no config file found
let config
try {
  config = require('./config.js')
} catch (e) {
  console.error('Need to setup config.js. Run `./setup_config.sh --help`')
  process.exit()
}

let express = require('express')
let bodyParser = require('body-parser')
let nunjucks = require('nunjucks')
let app = express()
let db = require('./database')

// Set the server's port
app.set('port', config.server.port)

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

// Connect to MongoDB and start web server on success
db(err => {
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
