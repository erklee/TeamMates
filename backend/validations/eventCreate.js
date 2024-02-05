const { check } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");
const path = require('path');
const { fileURLToPath } = require('url');
require('dotenv').config();


// const __filename = fileURLToPath(import.meta.env);
// const __dirname = path.dirname(__filename);



const validateEventCreation = [
    check("title")
        .exists({ checkFalsy: true })
        .withMessage("Title is invalid."),
    check("date")
        .exists({ checkFalsy: true })
        .withMessage("You must enter a date.")
        .custom(value => {
            let time;
            try {
                time = new Date(value).getTime();
            } catch(err) {
                return new Error("Date cannot be parsed.")
            }
            return new Date(time - 172800000) > Date.now() 
        })
        .withMessage("Date must be at least 2 days from now."),
    check("attendeesMax")
        .custom(value => {
            return value >= 2;
        })
        .withMessage("Event must have at least 2 attendees at maximum capacity."),
    check("location")
        .custom(async locationObj => {
            const res = await fetch(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${process.env.VITE_APP_GOOGLE_MAPS_API_KEY}`, {
                method: 'POST',
                body: JSON.stringify({ address: { addressLines: [locationObj.address + locationObj.zipcode]}}),
            })
            if(res.ok) {
                const addressValidationData = await res.json();
                const validComponents = addressValidationData
                    .result
                    .address
                    ?.addressComponents
                    ?.filter(component => component.confirmationLevel === 'CONFIRMED')
                    ?.map(component => component.componentType);
                console.log(validComponents)
                if(validComponents === undefined) return Promise.reject()
                if(!['street_number', 'route', 'locality', 'country'].every(component => validComponents.includes(component))) return Promise.reject();
            }
            else return false
        })
        .withMessage("Address is invalid"),
        
    handleValidationErrors
]

module.exports = validateEventCreation
