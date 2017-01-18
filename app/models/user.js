var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    admin: Boolean,
    meat: Boolean,
    salad: Boolean,
    tomato: Boolean,
    goat_cheese: Boolean,
    emmental_cheese: Boolean,
    onion: Boolean,
    bacon: Boolean,
    drink: { type: String, enum: ['Beer', 'Coca-Cola', 'Water', 'Lemon-Fanta', 'Orange-Fanta', 'Nothing'] },
    comments: String
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);
