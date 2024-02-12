// const { check } = require("express-validator");
// const handleValidationErrors = require("./handleValidationErrors");
// const path = require('path');
// const { fileURLToPath } = require('url');
// require('dotenv').config();


// // const __filename = fileURLToPath(import.meta.env);
// // const __dirname = path.dirname(__filename);



// const validateEventCreation = [
//     check("title")
//         .exists({ checkFalsy: true })
//         .withMessage("Title is invalid."),
//     check("date")
//         .exists({ checkFalsy: true })
//         .withMessage("You must enter a date.")
//         .custom(value => {
//             let time;
//             try {
//                 time = new Date(value).getTime(); 
//             } catch(err) {
//                 return new Error("Date cannot be parsed.")
//             }
//             return new Date(time - 172800000) > Date.now() 
//             // 172800000 is 2 days in milliseconds. Date.now() returns the number of milliseconds
//             // that have passed since 12:00AM January 1st, 1970. This works in all cases to return
//             // true or false depending on whether or not the new Event is set for at least 2 days from now.
//         })
//         .withMessage("Date must be at least 2 days from now."),
//     check("attendeesMax")
//         .custom(value => {
//             return value >= 2;
//         })
//         .withMessage("Event must have at least 2 attendees at maximum capacity."),
//     check("location")
//         .custom(async locationObj => {

//             // Make request Google Maps Address Validation API and store the response.
//             const res = await fetch(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${process.env.VITE_APP_GOOGLE_MAPS_API_KEY}`, {
//                 method: 'POST',
//                 body: JSON.stringify({ address: { addressLines: [locationObj.address + locationObj.zipcode]}}),
//             })

//             // if the reponse came back with a status of "OK" we will continue to peform validations
//             if(res.ok) {

//                 // Google Maps API sends back a stringified JSON response with the following structure:
//                 // {
//                 //     "result": {
//                 //         ...
//                 //         "address": {
//                 //             ...
//                 //             "addressComponents": [
//                 //                {
//                 //                     ...
//                 //                     "confirmationLevel": "CONFIRMED" | "UNCONFIRMED_BUT_PLAUSIBLE" | "UNCONFIRMED_BUT_SUSPICIOUS",
//                 //                     "componentType": "street_number" | "route" | "locality" | "country" | "zipcode"
//                 //                     ...
//                 //                }
//                 //             ]
//                 //         }
//                 //     }
//                 // }
//                 // So with this in mind, first we parse the response into a JSON object.
//                 const addressValidationData = await res.json();
//                 // Then we key into the addressComponents...
//                 const validComponents = addressValidationData
//                     .result
//                     .address
//                     ?.addressComponents // ...Filter them down to only confirmed components...
//                     ?.filter(component => component.confirmationLevel === 'CONFIRMED') // ... and store the names of the components in an array.
//                     ?.map(component => component.componentType);
//                 if(validComponents === undefined) return Promise.reject(); // Error handling
//                 // In any case we can probably infer the zipcode, but one is not required for a valid address.
//                 // So in this case we will only concern ourselves with 'street_number', 'route', 'locality', and 'country'.
//                 // If they are all included in the validComponents array, then the post-processed
//                 // address, which includes any inferred components, has been confirmed, and 
//                 // we can safely assume this address will show up on the map.
//                 if(!['street_number', 'route', 'locality', 'country'].every(component => validComponents.includes(component))) return Promise.reject();
//             }
//             else return Promise.reject();
//         })
//         .withMessage("Address is invalid."),
        
//     handleValidationErrors
// ]

// module.exports = validateEventCreation


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
            return new Date(time - 172800000) > Date.now();
        })
        .withMessage("Date must be at least 2 days from now."),
    check("attendeesMax")
        .custom(value => {
            return value >= 2;
        })
        .withMessage("Event must have at least 2 attendees at maximum capacity."),
    check("location")
        .custom(async locationObj => {

            // Make request Google Maps Address Validation API and store the response.
            const res = await fetch(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${process.env.VITE_APP_GOOGLE_MAPS_API_KEY}`, {
                method: 'POST',
                body: JSON.stringify({ address: { addressLines: [locationObj.address + locationObj.zipcode]}}),
            })

            // if the reponse came back with a status of "OK" we will continue to peform validations
            if(res.ok) {

                // Google Maps API sends back a stringified JSON response with the following structure:
                // {
                //     "result": {
                //         ...
                //         "address": {
                //             ...
                //             "addressComponents": [
                //                {
                //                     ...
                //                     "confirmationLevel": "CONFIRMED" | "UNCONFIRMED_BUT_PLAUSIBLE" | "UNCONFIRMED_BUT_SUSPICIOUS",
                //                     "componentType": "street_number" | "route" | "locality" | "country" | "zipcode"
                //                     ...
                //                }
                //             ]
                //         }
                //     }
                // }
                // So with this in mind, first we parse the response into a JSON object.
                const addressValidationData = await res.json();
                // Then we key into the addressComponents...
                const validComponents = addressValidationData
                    .result
                    .address
                    ?.addressComponents // ...Filter them down to only confirmed components...
                    ?.filter(component => component.confirmationLevel === 'CONFIRMED') // ... and store the names of the components in an array.
                    ?.map(component => component.componentType);
                if(validComponents === undefined) return Promise.reject(); // Error handling
                // In any case we can probably infer the zipcode, but one is not required for a valid address.
                // So in this case we will only concern ourselves with 'street_number', 'route', 'locality', and 'country'.
                // If they are all included in the validComponents array, then the post-processed
                // address, which includes any inferred components, has been confirmed, and 
                // we can safely assume this address will show up on the map.
                if(!['street_number', 'route', 'locality', 'country'].every(component => validComponents.includes(component))) return Promise.reject();
            }
            else return Promise.reject();
        })
        .withMessage("Address is invalid."),
        
    handleValidationErrors
]

module.exports = validateEventCreation