'use strict'

// Config for the server
exports.server = {
  'port': 3000
}

exports.development = (process.env.NODE_ENV !== 'production')

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
  'dev': {
    'teamId': '1940407', // github.com/dvcoders-test
    'apiKey': process.env.GITHUB_API_KEY_DEV || null
  },
  'teamId': '1679886', // github.com/dvcoders
  'apiKey': process.env.GITHUB_API_KEY || null,
  'userAgent': process.env.GITHUB_USER_AGENT || null
}

exports.slack = {
  'dev': {
    'team': 'dvcoders-test',
    'token': process.env.SLACK_TOKEN_DEV || null
  },
  'team': 'dvcoders',
  'token': process.env.SLACK_TOKEN || null
}

