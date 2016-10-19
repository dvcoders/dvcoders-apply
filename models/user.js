'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
  firstName: {
    type: String,
    maxLength: 35,
    required: true,
    match: [/^[a-zA-Z\u00C0-\u017F' -]+$/, 'Please enter valid name characters']
  },
  lastName: {
    type: String,
    maxLength: 35,
    required: true,
    match: [/^[a-zA-Z\u00C0-\u017F' -]+$/, 'Please enter valid name characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w.+-]*\w+@[\w-]+(\.[\w-]+)+$/, 'Please enter a valid email']
  },
  mailchimp: Boolean,
  github: {
    type: String,
    maxLength: 35,
    match: [/^[a-zA-Z0-9-]+$/, 'Please enter valid username characters']
  },
  description: {
    type: Schema.ObjectId,
    ref: 'Survey'
  },
  submittedSurvey: Boolean
})

module.exports = mongoose.model('User', userSchema)
