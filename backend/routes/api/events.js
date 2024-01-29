
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
        return res.json(event);
    }
    catch(err) {
        return res.json({ errors: ["Could not find this event"] })
    }
})

router.patch("/:id/attend", requireUser, async function(req, res, next) {
    const event = { current: null }
    try {
        event.current = await Event.findById(req.params.id)
        
    }
    catch(err) {
        return res.json({ errors: ["Could not find Event #{VALUE}"]})
    }
    try {
        if (event.current.attendees.includes(req.user._id)) return res.json(["You are already attending this event"])
        event.current.attendees.push(req.user._id);
        event.current.save();
        return res.json(event.current);
    }
    catch(err) {
        next(err)
    }
})

router.patch("/:id/unattend", requireUser, async function(req, res, next) {
    const event = { current: null }
    try {
        event.current = await Event.findById(req.params.id)
        
    }
    catch(err) {
        return res.json({ errors: ["Could not find Event #{VALUE}"]})
    }
    try {
        if (!event.current.attendees.includes(req.user._id)) return res.json(["You are not attending this event"])
        event.current.attendees = event.current.attendees.filter(attendee => {
            return attendee.equals(req.user._id)
        });
        const patchedEvent = await event.current.save();
        return res.json(patchedEvent);
    }
    catch(err) {
        next(err)
    }
})


router.post("/", requireUser, async function(req, res, next) {
    // let user
    // try {
    //     user = await fetch('/api/users/current');
    // }
    // catch(err) {
    //     return res.json("Must be logged in to create an event")
    // }
    try {
        const newEvent = new Event({
            coordinator: req.user._id,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category.toLowerCase(),
            date: new Date(req.body.date),
            attendeesMax: parseInt(req.body.attendeesMax),
            attendees: [req.user._id],
            location: {
                address: req.body.location.address,
                zipcode: req.body.location.zipcode
            }
        });
        let event = await newEvent.save();
        return res.json(event);
    } 
    catch(err) {
        next(err)
    }
});

module.exports = router;