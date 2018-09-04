//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

//   db.collection('Todos').findOneAndUpdate({
//     _id: new ObjectID('5b8d3543c8860916f4843d31')
//   }, {
//     $set: {
//       completed: true
//     }
//   }, {
//     returnOriginal: false
// }).then((result) => {
//   console.log(result);
// })

db.collection('Users').findOneAndUpdate({
  _id : new ObjectID('5b8d2885b4b8a7338cbff4f8')
}, {
  $set: {
    name: 'Carl'
  },
  $inc: {
    age: 1
  }
}, {
  returnOriginal: false
}).then((result) => {
  console.log(result);
});

 //db.close();
});
