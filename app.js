'use strict';

let express = require('express');
let app = express();
let config = require('./config.js').server;

app.set('port', process.env.PORT || config.port || 3000);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

let server = app.listen(app.get('port'), () => {
  console.log(`Server running on port ${server.address().port}`);
});
