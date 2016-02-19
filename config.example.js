'use strict'

// Config for the server
exports.server = {
  'port': process.env.PORT || 3000
}

// Config for the rendering client
exports.client = {
  'title': 'dvcoders'
}

exports.mongodb = {
  'address': process.env.MONGODB_URL || 'localhost',
  'database': process.env.MONGODB_DATABASE || 'dvcoders'
}

exports.github = {
  'apiKey': '${GITHUB_API_KEY}',
  'userAgent': '${GITHUB_USER_AGENT}'
}

exports.slack = {
  'token': '${SLACK_TOKEN}'
}
