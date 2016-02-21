'use strict'

let winston = require('winston')

// Creates and returns a new logging instance
module.exports = () => (new winston.Logger({
  'transports': [new winston.transports.Console({
    'level': 'debug',
    'handleExceptions': false,
    'json': false,
    'colorize': true,
    'timestamp': true,
  })],
  'exitOnError': false
}))

