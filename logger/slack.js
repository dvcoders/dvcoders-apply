'use strict'

let util = require('util')
let winston = require('winston')
let NodeSlack = require('node-slack')

//
// ### function Slack (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Slack transport object responsible
// for persisting log messages and metadata to Slack.
//
let Slack = exports.Slack = function (options) {
  options = options || {}

  this.webhookUri = options.webhookUri
  this.username = options.username
  this.channel = options.channel
  this.level = options.level || 'error'
  this.silent = options.silent || false
  this.handleExceptions = options.handleExceptions || false
  this.iconUrl = options.iconUrl
  this.slack = new NodeSlack(this.webhookUri)
}

//
// Inherit from `winston.Transport`.
//
util.inherits(Slack, winston.Transport)

//
// Expose the name of this Transport on the prototype
//
Slack.prototype.name = 'Slack'

winston.transports.Slack = Slack
//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
//
Slack.prototype.log = function (level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true)
  }

  this.slack.send({
    text: '[' + level + '] ' + msg,
    channel: this.channel,
    username: this.username,
    icon_url: this.iconUrl
  })

  callback(null, true)
}
