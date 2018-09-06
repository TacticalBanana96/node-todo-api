require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
// const port = process.env.PORT || 3000;
 const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator : req.user._id}).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /Todos/12345678
app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({ _id: id, _creator: req.user._id}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id',authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOneAndRemove({_id: id, _creator: req.user._id}).then((todo) => {
    if (!todo){
      return res.status(404).send();
    }
    res.status(200).send({todo});

  }).catch((e)=> {
    res.status(400).send();
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

  app.post('/users', (req, res)=> {
    var user = new User(_.pick(req.body, ['email', 'password']));

     user.save().then(() => {
       return user.generateAuthToken();
     }).then((token) => { //chaining onto the promise returned by generateAuthToken()
       res.header('x-auth', token).send(user);//this is responding with the user var defined above which was edited in user.js by using the var user = this
                                              //header(headerName, value) when starting a header with 'x-' you are making a custom header
     }).catch((e) => {
       res.status(400).send(e);
     });
  });

  app.get('/users/me', authenticate, (req, res) => { //uses the middleware authenticate
    res.send(req.user);
  });

  //POST /users/login {email, password}
  //make a post request and send email and pass then find a user with email matching and hash pass matching using bcrypt.compare()
  app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => { // this is returned so that the errors will be caught in the .catch
        res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
      res.status(400).send();
    });
  });

  app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
      res.status(200).send()
    }, (e) => {
      res.status(400).send()
    });
  });

app.listen(port, () =>{
  console.log(`Starting on port ${port}`);
});

module.exports = {app};
