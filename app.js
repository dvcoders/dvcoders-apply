'use strict';

let express = require('express');
let nunjucks = require('nunjucks');
let app = express();
let config = require('./config.js');
let utils = require('./utils.js');

// Set the server's port
app.set('port', process.env.PORT || config.server.port || 3000);

// Allow templates to access config.client settings
app.locals.app = config.client;

app.use(express.static('public'));

// Create the logging utility
let logger = require('./logger.js')();

// Pass express data through the logger
app.use(require('morgan')('dev', {
  'stream': {
    'write': (message, encoding) => {logger.info(message);}
  }
}));

// Set express to use the nunjucks engine,
// and configure nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Create routing
require('./routes.js')(app, logger);

// Start the server
let server = app.listen(app.get('port'), () => {
  logger.info(`Server running on port ${server.address().port}`);
});
