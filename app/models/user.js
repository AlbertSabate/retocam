var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    index: true
  },
  password: {
    type: String,
    select: false
  },
  authToken: String,
  admin: Boolean,
  meat: Boolean,
  salad: Boolean,
  tomato: Boolean,
  goatCheese: Boolean,
  emmentalCheese: Boolean,
  onion: Boolean,
  bacon: Boolean,
  drink: {
    type: String,
    enum: [
      'Beer',
      'Coca-Cola',
      'Water',
      'Lemon-Fanta',
      'Orange-Fanta',
      'Nothing'
    ]
  },
  comments: String,
  status: {
    type: String,
    enum: [
      'active',
      'inactive'
    ],
    default: 'active'
  },
  updatedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.methods.isAdmin = function() {
  return (this.admin) ? true : false;
};

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
