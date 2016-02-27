# dvcoders-backend
Our backend server (Node.js + MongoDB)

## REQUIREMENTS
 * [Node.js & NPM](https://nodejs.org/en/)
 * [MongoDB](https://www.mongodb.org/)

###For testing:
 * [Mocha](https://mochajs.org/)
 * [Supertest](https://github.com/visionmedia/supertest)

## INSTALLATION
You need to set these following environment variables for Github API key, User Agent values, and Slack token:
 * GITHUB_API_KEY - Github API key.
 * GITHUB_USER_AGENT - your github username.
 * SLACK_TOKEN - Slack token.
 * SLACK_WEBHOOK_URI - Slack Webhook Uri.

Then run from your terminal:
```bash
git clone git@github.com:dvcoders/dvcoders-backend.git
cd dvcoders-backend
npm install
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
    "watch": true,
    "env": {
      "GITHUB_API_KEY": "$GITHUB_API_KEY",
      "GITHUB_USER_AGENT": "$GITHUB_USER_AGENT",
      "SLACK_TOKEN": "$SLACK_TOKEN",
      "SLACK_WEBHOOK_URI": "$SLACK_WEBHOOK_URI"
    }
  }]
}
EOF
pm2 start server.json
```

## TESTING
Set up all the required env variables, install development dependencies, and run from your terminal:
```bash
mocah test app.js
```
