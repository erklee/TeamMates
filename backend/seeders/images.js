require('dotenv').config();
const mongoose = require("mongoose");
const { mongoURI: db } = require('../config/keys.js');
const User = require('../models/User.js');
const Event = require('../models/Event.js');



const DEFAULT_PROFILE_IMAGE_URL = 'https://mern-teammates-seeds.s3.amazonaws.com/public/blank-profile-pic.png'; // <- Insert the S3 URL that you copied above here

// Connect to database
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB successfully');
    initializeImages();
  })
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });

// Initialize image fields in db
const initializeImages = async () => {
  console.log("Initializing profile avatars...");
  await User.updateMany({}, { profileImageUrl: DEFAULT_PROFILE_IMAGE_URL });
  await Event.updateMany({}, { pictureUrl: "https://mern-teammates-seeds.s3.amazonaws.com/public/allSports.jpeg" })
  console.log("Done!");
  mongoose.disconnect();
}