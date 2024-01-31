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
          type: String,
          required: false
        },
        city: {
          type: String,
          required: false
        },
        state: {
          type: String,
          required: false
        },
        zipcode: {
          type: String,
          required: false
        }
    },
    requestIds: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    },
    friendIds: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    }
  }, {
    timestamps: true
  });

  userSchema.add

  module.exports = mongoose.model('User', userSchema);