'use strict'

// Config for the server
exports.server = {
  'port': 3000
}

exports.mongodb = {
  'address': process.env.MONGODB_URL || 'localhost',
  'database': process.env.MONGODB_DATABASE || 'dvcoders',
  'port': process.env.MONGODB_PORT || '27017'
}

// Config for the rendering client
exports.client = {
  'title': 'dvcoders'
}

exports.github = {
  'apiKey': process.env.GITHUB_API_KEY || null,
  'userAgent': process.env.GITHUB_USER_AGENT || null
}

exports.slack = {
  'token': process.env.SLACK_TOKEN || null
}
