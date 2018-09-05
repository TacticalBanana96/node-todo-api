const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 1,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
    password:{
      type: String,
      required: true,
      minlength: 8
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
});

UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']); // picks out the id and email and returns them in res.send(user) in server.js
                                              // this is to prevent sensitive info like our token and password from being returned
};

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token  = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  // user.tokens.push({access, tokens}); //due to inconsistencies across mongoDb versions this can cause errors
  user.tokens = user.tokens.concat([{access, token}]); // this works across a wider range of mongo versions
  return user.save().then(()=> { //save() returns a promise so we use the .then. We return this promise so that we can later chain onto it in server.js
    return token;
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};
