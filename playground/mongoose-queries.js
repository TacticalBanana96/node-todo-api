const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');




// var id = '5b8d830ca07c89140613ef5e';
//
// if(!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }
//
// // Todo.find({
// //   _id: id //mongoose does not require passing an ObjectID
// // }).then((todos) => {
// //   console.log('Todos', todos);
// // });
// //
// // Todo.findOne({
// //   _id: id //mongoose does not require passing an ObjectID
// // }).then((todo) => {
// //   console.log('Todo', todo);
// // });
//
// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log('ID not found');
//   }
//   console.log('Todo by ID', todo);
// }).catch((e) => console.log(e));

var userId = '5b8d50a9abcfe4f438ce8fff';

User.findById(userId).then((user) => {
  if(!user){
    return console.log('user not found');
  }
  console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
