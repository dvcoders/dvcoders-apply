'use strict';

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dvcoders');
let db = mongoose.connection;

module.exports = cb => {
  db.on('error', cb);
  db.once('open', cb);
};
