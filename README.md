# dvcoders-backend
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)


dvcoders Spring 2016 custom backend server using Node.js and MongoDB.

Features:

- Unified signup form for all dvcoders services
- Automatic Slack invitations upon submission
- Automatic Github organization invitation
- NoSQL database for variety of fields/schema
- Entry survey (interested, experience level, etc.)

### Requirements
*Setup*

 * [Node.js & NPM](https://nodejs.org/en/)
 * [MongoDB](https://www.mongodb.org/)


*Testing*

 * [Mocha](https://mochajs.org/)
 * [Supertest](https://github.com/visionmedia/supertest)

### Installation
You need to set these following environment variables for Github API key, User Agent values, and Slack token:

 * `GITHUB_API_KEY` - Github API key (from https://github.com/settings/tokens)
 * `GITHUB_USER_AGENT` - Your github username.
 * `SLACK_TOKEN` - Slack token (from https://api.slack.com/web)

Then run from your terminal:

```bash
git clone git@github.com:dvcoders/dvcoders-backend.git
cd dvcoders-backend
npm install
```

### Running

*For development work:*

Set `NODE_ENV=development`.Export separate development keys `GITHUB_API_KEY_DEV` and `SLACK_TOKEN_DEV`. Additionally change values in `config.js`

```js
exports.github = {
  'dev': {
    'teamId': '1940407', // github.com/dvcoders-test
    'apiKey': process.env.GITHUB_API_KEY_DEV || null
  },

...

exports.slack = {
  'dev': {
    'team': 'dvcoders-test',
    'token': process.env.SLACK_TOKEN_DEV || null
  },
```

Use [`nodemon`](http://nodemon.io/) to have the server restart automatically when changes are made.

```bash
npm install -g nodemon
nodemon app.js
```

*For production deployment:*

Use [`pm2`](http://pm2.keymetrics.io/) to handle log management and server crashes.

```bash
npm install -g pm2
cat <<EOF > server.json
{
  "apps": [{
    "name": "dvcoders-backend",
    "script": "app.js",
    "watch": true,
    "env": {
      "GITHUB_API_KEY": "$GITHUB_API_KEY",
      "GITHUB_USER_AGENT": "$GITHUB_USER_AGENT",
      "SLACK_TOKEN": "$SLACK_TOKEN"
      }
  }]
}
EOF
pm2 start server.json
```

### Testing
Set up all the required env variables, install development dependencies, and run from your terminal:

```bash
mocha test app.js
```
