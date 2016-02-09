'use strict'

let mongoose = require('mongoose')
let config = require('./config').mongodb
mongoose.connect(`mongodb://${config.address}/${config.database}`)
let db = mongoose.connection

module.exports = cb => {
  db.on('error', cb)
  db.once('open', cb)
}
