const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({})
// Todo.remove({}).then((result) =>{ //removes all
//   console.log(result);
// });


// Todo.findOneAndRemove
// Todo.findByIdAndRemove


Todo.findOneAndRemove('5b8f118bbbe678c1ac4640ff').then((todo) => {
  console.log(todo);
});

Todo.findOneAndRemove({_id: '5b8f118bbbe678c1ac4640ff'}).then((todo) => {
  console.log(todo);
});
