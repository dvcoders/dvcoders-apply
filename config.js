'use strict'

// Config for the server
exports.server = {
  'port': 3000
}

// Config for the rendering client
exports.client = {
  'title': 'dvcoders'
}

exports.github = {
  'apiKey': process.env.GITHUB_API_KEY,
  'userAgent': process.env.GITHUB_USER_AGENT
}
