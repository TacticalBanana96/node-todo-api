var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds245082.mlab.com:45082/todoapp' || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};
