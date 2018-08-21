const mongoose = require('mongoose');
const moment = require('moment');

const Product = mongoose.model('Product', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  body: {
    type: String,
    required: true,
    minlength: 1,
    trim: 1
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: moment().valueOf()
  }
  // _creator: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true
  // }
});

module.exports = {Product};
