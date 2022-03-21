
var mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');

// UserPost Schema
var UserSchema = mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    
    postinfo: {
        title:  {type : String},
        description:    {type : String},
        imageurl:   {type : String},
        cloudinaryid:   {type : String}
      }

});

var UserPost = module.exports = mongoose.model('UserPost', UserSchema);
  