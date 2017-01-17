var config = {};

// Port
config.port = process.env.PORT || 1234;

// Mongoose
config.mongooseUri = '';
config.mongooseOptions = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  replset: { rs_name: 'myReplicaSetName' },
  user: 'myUserName',
  pass: 'myPassword'
}

module.exports = config;
