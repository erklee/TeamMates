const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const isUserOver13 = (value) => {
  const today = new Date();
  const birthdate = new Date(value);
  const age = today.getFullYear() - birthdate.getFullYear();

  if (age < 13) {
    throw new Error('You must be 13 years or older to register');
  }

  return true;
};

const validateRegisterInput = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Email is invalid'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  check('fname')
    .exists({ checkFalsy: true })
    .withMessage('First name must exist'),
  check('lname')
    .exists({ checkFalsy: true })
    .withMessage('Last name must exist'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6, max: 30 })
    .withMessage('Password must be between 6 and 30 characters'),
  check('birthdate')
    .exists({ checkFalsy: true })
    .isISO8601()
    .custom(isUserOver13) 
    .withMessage('You must be 13 years or older to register'),
  check('address.zipcode')
    .optional({ checkFalsy: true })
    .isLength({ min: 5, max: 5 })
    .withMessage('Zipcode must be exactly 5 digits')
    .isNumeric()
    .withMessage('Zipcode must be a numeric value'),
  handleValidationErrors
];



module.exports = validateRegisterInput;