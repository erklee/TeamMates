
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');

const { requireUser } = require('../../config/passport');


router.get("/", async function(req, res, next) {
    try {
        const events = await Event.find({})
                            .populate("coordinator", "_id username")
                            .populate("attendees", "_id username");
        return res.json(events);
    } 
    catch(err) {
        return res.json([])
    }
})

router.get("/:id", async function(req, res, next) {
    try {
        const event = await Event.findById(req.params.id);
    }
    catch(err) {
        return res.json({ errors: "Can't find this event" })
    }

})


router.post("/", requireUser, async function(req, res, next) {
    let user
    try {
        user = await fetch('/api/users/current');
    }
    catch(err) {
        return res.json("Must be logged in to create an event")
    }
    try {
        const newEvent = new Event({
            coordinator: user._id,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            date: req.body.date,
            attendeesMax: req.body.attendeesMax,
            attendees: [user],
            location: {
                address: req.body.location.address,
                zipcode: req.body.location.zipcode
            }
        });
        let event = await newEvent.save();
        return res.json(tweet);
    } 
    catch(err) {
        next(err)
    }
})

router.get("/:id", async function(req, res, next) {
    
})

module.exports = router;