let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  mailchump: Boolean,
  description: {
    id: Schema.Types.ObjectId,
    ref: 'survey'
  }
});
