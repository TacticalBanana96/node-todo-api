var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test'){
  var config = require('./config.json'); //when requiring a json file you dont need to parse it
  var envConfig = config[env]; //returns the object for that env

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}


// if(env === 'development'){
//   process.env.port = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if(env === 'test'){
//   process.env.port = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
