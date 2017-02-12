var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    index: true,
    trim: true
  },
  password: {
    type: String,
    select: false
  },
  authToken: {
    type: String,
    select: false
  },
  admin: {
    type: Boolean,
    default: false
  },
  group: String,
  eatType: {
    type: String,
    enum: [
      'all',
      'veggy',
      'vegan'
    ]
  },
  burgerIngredients: {
    type: Array
    // TODO Validate ['salad', 'tomato', 'cheese', 'bacon']
  },
  drink: {
    type: String,
    enum: [
      'beer',
      'coca-cola',
      'water',
      'lemon-fanta',
      'orange-fanta',
      'nothing'
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
