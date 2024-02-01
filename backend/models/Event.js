const SPORTS = [
    "basketball",
    "football",
    "baseball",
    "tennis",
    "soccer",
    "hockey"
]

const DIFFICULTIES = [
    "easy",
    "medium",
    "hard"
]


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  coordinator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    enum: { values: SPORTS, message: '{VALUE} is not supported'},
    required: true,
  },
  date: Date,
  attendeesMax: {
    type: Number,
    default: 10,
    min: [2, 'Must have more than one attendee at maximum'],
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  location: {
    address: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },

  },
  difficulty: {
    type: String,
    enum: { values: DIFFICULTIES, message: '{VALUE} is not supported'},
    required: true,
  },
  pictureUrl: {
    type: String,
    required: false,
    },


    description: String,
    category: {
        type: String,
        enum: { values: SPORTS, message: '{VALUE} is not supported'},
        required: true
    },
    date: Date,
    attendeesMax: {
        type: Number,
        default: 10,
        min: [2, 'Must have more than one attendee at maximum']
    },
    attendees: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    location: {
        address: {
            type: String,
            required: true
        },
        zipcode: {
            type: String,
            required: true
        },
    },
    difficulty: {
        type: String,
        enum: { values: DIFFICULTIES, message: '{VALUE} is not supported'},
        required: true
    }

},
{
  timestamps: true,
});


function addressValidator(address) {
  return /^ {0,}(\d{1,}) +([\w,']{1,} [\w,']{1,}[.]{0,1}) {0,}$/gm;
}

module.exports = mongoose.model('Event', eventSchema);