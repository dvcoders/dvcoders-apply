'use strict'

let winston = require('winston')
let util = require('util')
let slack = require('./slack')
let config = require('../config.js')

// Creates and returns a new logging instance
module.exports = () => (new winston.Logger({
  'transports': [
    new winston.transports.Console({
      'level': 'debug',
      'handleExceptions': false,
      'json': false,
      'colorize': true,
      'timestamp': true
    }),
    new winston.transports.Slack({
      channel: '#general',
      webhookUri: config.slack.webhookUri,
      username: 'ErrorBot',
      level: 'error'
    })
  ],
  'exitOnError': false
}))
