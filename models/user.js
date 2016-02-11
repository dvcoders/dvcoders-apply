'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
  firstName: {
    type: String,
    maxLength: 35,
    match: [/[a-zA-Z\-\s]+/, 'Please enter valid name characters']
  },
  lastName: {
    type: String,
    maxLength: 35,
    match: [/[a-zA-Z\-\s]+/, 'Please enter valid name characters']
  },
  email: {
    type: String,
    match: [/^([\w\.\-_\+]+)?\w+@[\w-_]+(\.\w+){1,}$/, 'Please enter a valid email']
  },
  mailchimp: Boolean,
  github: {
    type: String,
    maxLength: 35,
    match: [/[a-zA-Z\-\s]+/, 'Please enter valid name characters']
  },
  description: {
    type: Schema.ObjectId,
    ref: 'Survey'
  }
})

module.exports = mongoose.model('User', userSchema)
