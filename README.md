# dvcoders-backend
Our backend server (Node.js + MongoDB)

## REQUIREMENTS
* [Node.js & NPM](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.org/)

### For testing:
* [Mocha](https://mochajs.org/)
* [Supertest](https://github.com/visionmedia/supertest)

## INSTALLATION
Run from your terminal:

```bash
git clone git@github.com:dvcoders/dvcoders-backend.git
cd dvcoders-backend
npm install
```

Then you need to create a [`.env`](https://github.com/motdotla/dotenv) file for the environment variables for your Github API key, Github User-Agent header, and Slack token:

* `GITHUB_API_KEY` - [Github API key](https://github.com/settings/tokens)
* `GITHUB_USER_AGENT` - Your Github username
* `SLACK_TOKEN` - [Slack token](https://api.slack.com/docs/oauth-test-tokens)

Example:

```text
GITHUB_API_KEY=9f869b245f49641b12137cb202ccb82c3f870eb9
GITHUB_USER_AGENT=dvcoders
SLACK_TOKEN=xoxp-1495209272-1796258573-9288732744-1b9d2f09
```

Make sure you have MongoDB running. On OSX, you can run:

```bash
brew install mongodb
brew services start mongodb
```

*For development work:*

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
    "watch": true
  }]
}
EOF
pm2 start server.json
```

## TESTING
Set up all the required env variables, install development dependencies, and run from your terminal:

```bash
mocha test app.js
```
