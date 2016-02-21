'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let surveySchema = new Schema({
  'experience': [String],
  'interests': [String],
  'more-interests': String,
  'projects': [String],
  'more-projects': [String],
  'events': [String],
  'more-events': [String],
  'user': {
    type: Schema.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Survey', surveySchema)
