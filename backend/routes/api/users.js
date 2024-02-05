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
const { ObjectId } = require('mongodb');

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
    profileImageUrl: req.user.profileImageUrl,
    address: {
      street: req.user.address.street,
      city: req.user.address.city,
      state: req.user.address.state,
      zipcode: req.user.address.zipcode
    }
  });
});


router.get('/:id', async (req, res, next) => {
  try {
    const userId = req?.params?.id;

    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const err = new Error('Invalid user ID');
      err.statusCode = 400;
      return next(err);
    }

    const user = await User.findById(userId);

    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }

   
    return res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      birthdate: user.birthdate,
      fname: user.fname,
      lname: user.lname,
      profileImageUrl: user.profileImageUrl,
      address: {
        street: user.address.street,
        city: user.address.city,
        state: user.address.state,
        zipcode: user.address.zipcode
      }
    });
  } catch (err) {
    next(err);
  }
});



router.patch('/:id/friend', requireUser, async (req, res, next) => {
  try {
    const friendUserId = req.params.id;
    const youUserId = req.user?._id;

    if (!youUserId || !ObjectId.isValid(youUserId)) {
      return res.status(400).json({ errors: ['Invalid user ID'] });
    }

    const friendUser = await User.findById(new ObjectId(friendUserId));
    const youUser = await User.findById(new ObjectId(youUserId));

    if (!youUser) {
      return res.status(400).json({ errors: ['You are not a valid user'] });
    }

    if (
      youUser.friendIds &&
      youUser.friendIds.some((friendId) => friendId.equals(friendUser._id))
    ) {
      return res.json({ errors: ['You are already friends with this user'] });
    }

    if (
      youUser.requestIds &&
      youUser.requestIds.some((requestId) => requestId.equals(friendUser._id))
    ) {
      friendUser.friendIds.push(youUser._id);
      friendUser.requestIds = friendUser.requestIds.filter((requestId) => !requestId.equals(youUser._id));
      youUser.friendIds.push(friendUser._id);
      youUser.requestIds = youUser.requestIds.filter((requestId) => !requestId.equals(friendUser._id));

      await youUser.save();
      await friendUser.save();

      
      return res.json({
        youUser,
        friendUser,
        sender: youUser, 
      });
    }

    friendUser.requestIds.push(youUser._id);
    await friendUser.save();

    
    return res.json({
      friendUser,
      sender: youUser, 
    });
  } catch (err) {
    next(err);
  }
});


router.patch('/:id/accept', requireUser, async (req, res, next) => {
  try {
    const friendUserId = req.params.id;
    const youUserId = req.user?._id;

    
    if (!youUserId || !ObjectId.isValid(youUserId)) {
      return res.status(400).json({ errors: ['Invalid user ID'] });
    }

    const friendUser = await User.findById(new ObjectId(friendUserId));
    const youUser = await User.findById(new ObjectId(youUserId));

    if (!youUser) {
      return res.status(400).json({ errors: ['You are not a valid user'] });
    }

    if (
      youUser.friendIds &&
      youUser.friendIds.some((friendId) => friendId.equals(friendUser._id))
    ) {
      return res.json({ errors: ['You are already friends with this user'] });
    }

    if (
      youUser.requestIds &&
      youUser.requestIds.some((requestId) => requestId.equals(friendUser._id))
    ) {
      friendUser.friendIds.push(youUser._id);
      friendUser.requestIds = friendUser.requestIds.filter((requestId) => !requestId.equals(youUser._id));
      youUser.friendIds.push(friendUser._id);
      youUser.requestIds = youUser.requestIds.filter((requestId) => !requestId.equals(friendUser._id));

      await youUser.save();
      await friendUser.save();

      
      return res.json({
        youUser,
        friendUser,
        sender: friendUser, 
      });
    }

    friendUser.requestIds.push(youUser._id);
    await friendUser.save();

    
    return res.json({
      sender: friendUser,
      youUser, 
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/reject', requireUser, async (req, res, next) => {
  try {
    const friendUserId = req.params.id;
    const youUserId = req.user?._id;

    
    if (!youUserId || !ObjectId.isValid(youUserId)) {
      return res.status(400).json({ errors: ['Invalid user ID'] });
    }

    const friendUser = await User.findById(new ObjectId(friendUserId));
    const youUser = await User.findById(new ObjectId(youUserId));

    if (!youUser) {
      return res.status(400).json({ errors: ['You are not a valid user'] });
    }

    if (
      youUser.requestIds &&
      youUser.requestIds.some((requestId) => requestId.equals(friendUser._id))
    ) {
      // Remove friendUser from your requestIds
      youUser.requestIds = youUser.requestIds.filter((requestId) => !requestId.equals(friendUser._id));

      await youUser.save();

      
      return res.json({
        youUser,
        friendUser,
        sender: youUser,
      });
    } else {
      return res.status(400).json({ errors: ['Friend request not found'] });
    }
  } catch (err) {
    next(err);
  }
});


router.patch('/:id/unfriend', requireUser, async (req, res) => {
  try {
    const friendUser = await User.findById(req.params.id);
    const youUser = await User.findById(req.user._id);

    if (
      youUser.friendIds &&
      youUser.requestIds &&
      youUser.friendIds.every(id => !id.equals(friendUser._id)) &&
      youUser.requestIds.every(id => !id.equals(friendUser._id))
    ) {
      return res.json({ errors: ["You are not friends with this user"] });
    }

    friendUser.friendIds = friendUser.friendIds.filter(id => !id.equals(youUser._id));
    friendUser.requestIds = friendUser.requestIds.filter(id => !id.equals(youUser._id));
    const fUser = await friendUser.save();
    youUser.friendIds = youUser.friendIds.filter(id => !id.equals(friendUser._id));
    youUser.requestIds = youUser.friendIds.filter(id => !id.equals(friendUser._id));
    const yUser = await youUser.save();
    return res.json([yUser, fUser]);
  } catch (err) {
    next(err);
  }
});

// Get friend requests for the logged-in user
router.get('/friend-requests/:id', requireUser, async (req, res, next) => {
  try {
    const youUserId = req.user?._id;

    if (!youUserId || !mongoose.Types.ObjectId.isValid(youUserId)) {
      return res.status(400).json({ errors: ['Invalid user ID'] });
    }

    const youUser = await User.findById(youUserId);
    
    if (!youUser) {
      console.error('User not found:', youUserId);
      return res.status(400).json({ errors: ['You are not a valid user'] });
    }

    const friends = await User.find({ _id: { $in: youUser.requestIds } });

    return res.json(friends);
  } catch (err) {
    next(err);
  }
});


router.get('/friends/:id', requireUser, async (req, res, next) => {
  try {
    const youUserId = req.user?._id;

    if (!youUserId || !ObjectId.isValid(youUserId)) {
      console.error('Invalid user ID:', youUserId);
      return res.status(400).json({ errors: ['Invalid user ID'] });
    }

    // Find the user by ID
    const youUser = await User.findById(youUserId);

    

    if (!youUser) {
      console.error('User not found:', youUserId);
      return res.status(400).json({ errors: ['You are not a valid user'] });
    }

    // Fetch the friends using 'friendIds' and project only the needed fields
    const friends = await User.find({ _id: { $in: youUser.friendIds } });

    return res.json(friends);
  } catch (err) {
    console.error('Error fetching friends:', err.message);
    next(err);
  }
});


module.exports = router;


// ...
