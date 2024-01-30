const { param } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");
const validateEventCreation = require("./eventCreate")

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

const validateEventUpdate = [
    param("id")
        .custom(isOwner),
    ...validateEventCreation,
    handleValidationErrors
]

module.exports = validateEventUpdate