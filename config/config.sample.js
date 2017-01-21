var config = {};

// Port
config.port = process.env.PORT || 8081;

// Secret
config.secret = 'ilovediables';

// Mongoose
config.mongooseUri = 'mongodb://localhost:27017/retocam';
config.mongooseOptions = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  replset: { rs_name: 'myReplicaSetName' },
  user: 'myUserName',
  pass: 'myPassword'
};

module.exports = config;
