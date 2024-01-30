const { check } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const validateEventCreation = [
    check("title")
        .exists({ checkFalsy: true })
        .withMessage("Invalid title"),
    check("date")
        .exists({ checkFalsy: true })
        .custom(value => {
            let time;
            try {
                time = new Date(value).getTime();
            } catch(err) {
                throw("Event date is not a date object")
            }
            return new Date(time - 172800000) > Date.now() 
        })
        .withMessage("date must be at least 2 days from now"),
    handleValidationErrors
]

module.exports = validateEventCreation
