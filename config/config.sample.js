var config = {};

// Port
config.port = process.env.PORT || 8080;
config.securePort = process.env.SECURE_PORT || 8585;

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

// Keys
config.privateKey = '';
config.certificate = '';

module.exports = config;
