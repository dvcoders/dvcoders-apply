'use strict'

let winston = require('winston')
let Slack = require('./slack.js').Slack
let config = require('../config.js')

// Creates and returns a new logging instance
module.exports = () => (new winston.Logger({
  'transports': [
    new (winston.transports.Console)({
      'level': 'debug',
      'handleExceptions': false,
      'json': false,
      'colorize': true,
      'timestamp': true
    }),
    new (Slack)({
      channel: '#server-logs',
      webhookUri: config.slack.webhookUri,
      username: 'dvserver',
      level: 'error',
      iconUrl: 'https://avatars1.githubusercontent.com/u/10080572?v=3&s=200'
    })
  ],
  'exitOnError': false
}))
