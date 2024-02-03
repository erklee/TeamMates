
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const validateEventCreation = require("./../../validations/eventCreate");
const validateEventUpdate = require('../../validations/eventUpdate');
const validateEventDestroy = require('../../validations/eventDelete');
const { requireUser } = require('../../config/passport');



router.get("/", async function (req, res, next) {
  try {
    const events = await Event.find({})
      .populate("coordinator", "_id username")
      .populate("attendees", "_id username");
    return res.json(events);
  } 
  catch(err) {
    return res.json([]);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const event = await Event.findById(req.params.id)
      .populate("coordinator", "_id username")
      .populate("attendees", "_id username fname lname");
    return res.json(event);
  }
  catch(err) {
    return res.json({ errors: ["Could not find this event"] });
  }
});

router.get('/user/:id', async function (req, res, next) {
  try {
    const event = await Event.find( { attendees: `${req.params.id}` })
      .populate("coordinator", "_id username")
      .populate("attendees", "_id username");
    return res.json(event);
  }
  catch(err) {
    return res.json({ errors: "Could not complete this request" });
  }
});

router.patch("/:id/attend", requireUser, async function (req, res, next) {
  let event;
  try {
    event = await Event.findById(req.params.id);
  }
  catch(err) {
    return res.json({ errors: [`Could not find this event`]});
  }
  try {
    if (event.attendees.includes(req.user._id)) return res.json({ errors: ["You are already attending this event"] });
    if (event.attendees.length === event.attendeesMax) return res.json({ errors: [`This event is at max attendance: ${event.attendeesMax} attendees`] });
    event.attendees.push(req.user._id);
    event.save();
    return res.json(event);
  }
  catch(err) {
    next(err);
  }
});

router.patch("/:id/unattend", requireUser, async function (req, res, next) {
  let event;
  try {
    event = await Event.findById(req.params.id);
  }
  catch(err) {
    return res.json({ errors: ["Could not find this event"]});
  }
  try {
    if (!event.attendees.some(attendeeId => attendeeId.equals(req.user._id))) return res.json({ errors: "You are not attending this event yet" });
    event.attendees = event.attendees.filter(attendeeId => {
      return !attendeeId.equals(req.user._id);
    });
    const patchedEvent = await event.save();
    return res.json(patchedEvent);
  }
  catch(err) {
    next(err);
  }
});


router.post("/", requireUser, validateEventCreation, async function (req, res, next) {
  try {
    const newEvent = new Event({
      coordinator: req.user._id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category.toLowerCase(),
      date: (typeof req.body.date === "Date" ? req.body.date : new Date(req.body.date)),
      difficulty: req.body.difficulty,
      attendeesMax: parseInt(req.body.attendeesMax),
      attendees: [req.user._id],
      location: {
        address: req.body.location.address,
        zipcode: req.body.location.zipcode,
      },
      pictureUrl: req.body.pictureUrl || "https://mern-teammates-seeds.s3.amazonaws.com/public/allSports.jpeg"
    });
    
    const event = await newEvent.save();
    return res.json(event);
  } 
  catch(err) {
    next(err);
  }
});

router.patch("/:id", requireUser, validateEventUpdate, async function (req, res, next) {
  let event;
  try {
    event = await Event.findById(req.params.id);
  }
  catch {
    return res.json({ errors: ["Event does not exist"] });
  }


  try {
    const { title, description, category, date, attendeesMax, attendees, location, difficulty } = req.body;
    let newAttrs = { title, description, category, date, attendeesMax, attendees, location, difficulty };

        
    Object.keys(newAttrs).forEach((key, idx) => {
      if (!!newAttrs[key]) event[key] = newAttrs[key];
    });
    
    const updatedEvent = await event.save();
    return res.json(updatedEvent);
  }
  catch(err) {
    next(err);
  }
});

router.delete("/:id", requireUser, validateEventDestroy, async function (req, res, next) {
  try {
    const event = Event.findByIdAndDelete(req.params.id).exec();
    if(event) return res.json("Success!");
  }
  catch(err) {
    if(event.errors) {
      err.errors = event.errors;
    }
    return res.json(err);
  }
});

module.exports = router;