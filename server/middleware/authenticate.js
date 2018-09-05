var {User} = require('./../models/user');

var authenticate = (req, res, next) => { // creating a private route
  var token = req.header('x-auth'); // retrieves the token which we placed in x-auth initially

  User.findByToken(token).then((user) => { //searches the users for the one with the matching token. If user is not found find by token returns a promise calling reject therefore .then never runs
    if(!user){
        return Promise.reject(); // this will stop the script, return an error case which will be caught in the .catch((e)) and the catch will send the status
    }

    req.user = user;
    req.token = token;
    next();
 }).catch((e) => {
   res.status(401).send();
 });
};

module.exports = {authenticate};
