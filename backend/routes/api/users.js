const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const router = express.Router();
const { loginUser, restoreUser, requireUser } = require('../../config/passport');
const { isProduction } = require('../../config/keys');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.json({
//     message: "GET /api/users"
//   });
// });


//routes/api/users.js

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({});

    return res.json(users);
  }
  catch(err) {
    next(err)
  }
})


router.post('/register', validateRegisterInput, async (req, res, next) => {
  // Check to make sure no one has already registered with the proposed email or
  // username.
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }]
  });

  if (user) {
    // Throw a 400 error if the email address and/or username already exists
    const err = new Error("Validation Error");
    err.statusCode = 400;
    const errors = {};
    if (user.email === req.body.email) {
      errors.email = "A user has already registered with this email";
    }
    if (user.username === req.body.username) {
      errors.username = "A user has already registered with this username";
    }
    err.errors = errors;
    return next(err);
  }

  // Otherwise create a new user
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    birthdate: req.body.birthdate,
    fname: req.body.fname,
    lname: req.body.lname,
    address: {
      street: req.body.address ? req.body.address.street : undefined,
      city: req.body.address ? req.body.address.city : undefined,
      state: req.body.address ? req.body.address.state : undefined,
      zipcode: req.body.address ? req.body.address.zipcode : undefined
    }
  });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
      if (err) throw err;
      try {
        newUser.hashedPassword = hashedPassword;
        const user = await newUser.save();
        return res.json(await loginUser(user)); // <-- THIS IS THE CHANGED LINE
      }
      catch(err) {
        next(err);
      }
    })
  });
});





// POST /api/users/login
router.post('/login', validateLoginInput, async (req, res, next) => {
  passport.authenticate('local', async function(err, user) {
    if (err) return next(err);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 400;
      err.errors = { email: "Invalid credentials" };
      return next(err);
    }
    return res.json(await loginUser(user)); // <-- THIS IS THE CHANGED LINE
  })(req, res, next);
});


router.get('/current', restoreUser, (req, res) => {
  if (!isProduction) {
    // In development, allow React server to gain access to the CSRF token
    // whenever the current user information is first loaded into the
    // React application
    const csrfToken = req.csrfToken();
    res.cookie("CSRF-TOKEN", csrfToken);
  }
  if (!req.user) return res.json(null);
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    birthdate: req.user.birthdate,
    fname: req.user.fname,
    lname: req.user.lname,
    address: {
      street: req.user.address.street,
      city: req.user.address.city,
      state: req.user.address.state,
      zipcode: req.user.address.zipcode
    }
  });
});

router.patch('/:id/friend', requireUser, async (req, res) => {
  try {
    const friendUser = await User.findById(req.params.id);
    const youUser = await User.findById(req.user._id);
    if(youUser.friendIds.some(requestId => requestId.equals(youUser._id))) return res.json(["You are already friends with this user"])
    if(youUser.requestIds.some(requestId => requestId.equals(friendUser._id))) {
      friendUser.friendIds.push(youUser._id);
      friendUser.requestIds = friendUser.requestIds.filter(requestId => !requestId.equals(youUser._id))
      youUser.friendIds.push(friendUser);
      youUser.requestIds = youUser.requestIds.filter(requestId => !requestId.equals(friendUser._id))
      youUser.save();
      friendUser.save();
      return res.json([
        youUser,
        friendUser
      ])
    }
    friendUser.requestIds.push(youUser._id);
    friendUser.save()
    return res.json([
      friendUser
    ])
  }
  catch(err) {
    next(err)
  }

})



module.exports = router;
