let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  mailchimp: Boolean,
  description: {
    id: Schema.Types.ObjectId,
    ref: 'survey'
  }
});
