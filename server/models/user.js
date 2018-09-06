const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.methods.removeToken = function(token) {
 //$pull is a mongoDb operator that allows you to remove objects from an array that match certain criteria

var user = this;

  return user.update({
    $pull:{
      tokens: {token} // es6 token:token
    }
  });

};

UserSchema.statics.findByToken = function (token){ //statics is similar to .methods except everything added to it becomes a model method instead of an instance method. i.e  similar to User.find() rather than user.save()
  var User = this;
  var decoded; // we make this undefined because if anything goes wrong in jwt.verify it will throw an error therefore we want to wrap it in a try catch block

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  }

  return User.findOne({ //returning this promise so that we can do some chaining within server.js
    '_id': decoded._id, //using quotes on id to keep it consistent
    'tokens.token': token, //quotes are required when there is a  '.' in the value
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password){
  var User = this
  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => { //res is a boolean
        if(res){
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};


UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')){ // Make sure that the password is only hashed if it was just modified. If it wasn't and we hash our already hashed password that can cause it to break
   bcrypt.genSalt(10, (err, salt) => { //genSalt(numOfRounds, callback)
    bcrypt.hash(user.password, salt, (err, hash)=>{
      user.password = hash;
      next();
     });
   });
} else {
  next();
}
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
