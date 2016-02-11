'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  mailchimp: Boolean,
  github: String,
  description: {
    type: Schema.ObjectId,
    ref: 'Survey'
  }
})

module.exports = mongoose.model('User', userSchema)
