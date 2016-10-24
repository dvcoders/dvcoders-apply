## dvcoders-apply
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Our apply website and server (Node.js + MongoDB)

### Requirements
* [Node.js & NPM](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.org/)

#### For testing
* [Mocha](https://mochajs.org/)
* [Supertest](https://github.com/visionmedia/supertest)

### Installation
Run from your terminal:

```bash
git clone git@github.com:dvcoders/dvcoders-apply.git
cd dvcoders-apply
npm install
```

Then you need to create a [`.env`](https://github.com/motdotla/dotenv) file for the environment variables for your Github API key, Github User-Agent header, and Slack token:

* `GITHUB_API_KEY` - [Github API key](https://github.com/settings/tokens)
* `GITHUB_USER_AGENT` - Your Github username
* `SLACK_TOKEN` - [Slack token](https://api.slack.com/docs/oauth-test-tokens)
* `SLACK_WEBHOOK_URI` - [Slack webhook URI](https://api.slack.com/incoming-webhooks)

Example:

```text
GITHUB_API_KEY=9f869b245f49641b12137cb202ccb82c3f870eb9
GITHUB_USER_AGENT=dvcoders
SLACK_TOKEN=xoxp-1495209272-1796258573-9288732744-1b9d2f09
SLACK_WEBHOOK_URI=https://hooks.slack.com/services/X0AB9CDE0/A0B12CD3E/a6Bcde3fGh45iJKlmnOp
```

Make sure you have MongoDB running. On OSX, you can run:

```bash
brew install mongodb
brew services start mongodb
```

### Running

#### For development work

Use [`nodemon`](http://nodemon.io/) to restart the server automatically when changes are made.

```bash
npm install -g nodemon
nodemon app.js
```

#### For production deployment

Use [`pm2`](http://pm2.keymetrics.io/) to handle log management and server crashes.

```bash
npm install -g pm2
cat <<EOF > server.json
{
  "apps": [{
    "name": "dvcoders-apply",
    "script": "app.js",
    "watch": true
  }]
}
EOF
pm2 start server.json
```

### Testing
Set up all the required env variables, install development dependencies, and run from your terminal:

```bash
npm test
```
