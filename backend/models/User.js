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
          type: Number,
          validate: {
            validator: function (v) {
              // Check if the zipcode is a 5-digit integer
              return /^[0-9]{5}$/.test(v.toString());
            },
            message: props => `${props.value} is not a valid 5-digit zipcode!`
          }
        }
      }
  }, {
    timestamps: true
  });

  

  module.exports = mongoose.model('User', userSchema);