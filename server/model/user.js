const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not an email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ id: user._id.toHexString() }, process.env.JWT_SECRET).toString()

  user.tokens.push({access, token})

  return user.save().then(() => {
    return token;
  })
}

UserSchema.methods.removeToken = function (token) {
  var user = this;
  return user.update({
    $pull: {
      tokens: {token}
    }
  })
}

const User = mongoose.model('User', UserSchema);

module.exports = {User}
