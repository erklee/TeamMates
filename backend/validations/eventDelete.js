const { param } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");
const Event = require("../models/Event");
const { ObjectId } = require("mongodb");

const isOwner = async (_id, { req }) => {
    try {
        const event = await Event.findById(_id)
        if(!event.coordinator.equals(req.user._id)) throw new Error("You did not coordinate this event");
    }
    catch(err) {
        throw(err);
    }

    return true;
}

const validateEventDestroy = [
    param("id")
        .custom(isOwner),
    handleValidationErrors
]

module.exports = validateEventDestroy