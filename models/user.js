
var mongoose = require('mongoose')

// User Schema
var UserSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile_pic:{
        type: String
    },
    dateofbirth:{
        type: Date
    },
    City:{
        type: String
    },
    Country:{
        type: String
    },
    about_me:{
        type: String
    }

});

var User = module.exports = mongoose.model('User', UserSchema);
  