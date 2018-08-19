var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var Posts = new Schema({
  name: {
    type: String,
    minlength: 1,
    required: true,
    trim: true
  },
  body: {
    minlength: 1,
    type: String,
    required: true,
    trim: true
  },
  author: {
    minlength: 1,
    type: String,
  },
  createdAt: {
    type: Number,
    default: null
  }
})

module.exports = {Posts};
