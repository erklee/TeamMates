const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    birthdate: {
        type: Date,
        required: true 
    },
    fname:{
      type: String,
      required: true
    },
    lname:{
      type: String,
      required: true
    },
    address: {
        street: {
          type: String
        },
        city: {
          type: String
        },
        state: {
          type: String
        },
        zipcode: {
          type: String,
          required: false,
        }
      }
  }, {
    timestamps: true
  });

  

  module.exports = mongoose.model('User', userSchema);