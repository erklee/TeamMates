const express = require('express');
const router = express.Router();
const passport = require('passport');
const FriendRequest = require('../../models/FriendRequest'); // Adjust the path as needed

// Middleware to ensure the user is authenticated
const requireAuth = passport.authenticate('jwt', { session: false });

// GET /api/friendRequests/incoming - Get incoming friend requests for the current user
router.get('/incoming', requireAuth, async (req, res) => {
    try {
      const incomingRequests = await FriendRequest.find({ recipient: req.user._id, status: 'pending' });
      res.json(incomingRequests);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // GET /api/friendRequests/outgoing - Get outgoing friend requests sent by the current user
  router.get('/outgoing', requireAuth, async (req, res) => {
    try {
      const outgoingRequests = await FriendRequest.find({ sender: req.user._id, status: 'pending' });
      res.json(outgoingRequests);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// POST /api/friendrequests/send - Send a friend request
router.post('/send', requireAuth, async (req, res) => {
  const { recipientId } = req.body;
  const senderId = req.user.id; // Assuming user id is available in req.user

  try {
    // Prevent sending a request to oneself
    if (senderId === recipientId) {
      return res.status(400).json({ message: "Cannot send a friend request to oneself." });
    }

    // Check for existing friend request
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      recipient: recipientId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists." });
    }

    // Create and save the new friend request
    const newFriendRequest = new FriendRequest({
      sender: senderId,
      recipient: recipientId,
      status: 'pending',
    });

    await newFriendRequest.save();
    res.status(201).json(newFriendRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/friendrequests/:id/accept - Accept a friend request
router.patch('/:id/accept', requireAuth, async (req, res) => {
  try {
    const friendRequestId = req.params.id;
    const friendRequest = await FriendRequest.findById(friendRequestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to accept this friend request." });
    }

    friendRequest.status = 'accepted';
    await friendRequest.save();

    res.json(friendRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/friendrequests/:id/reject - Reject a friend request
router.patch('/:id/reject', requireAuth, async (req, res) => {
  try {
    const friendRequestId = req.params.id;
    const friendRequest = await FriendRequest.findById(friendRequestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to reject this friend request." });
    }

    friendRequest.status = 'rejected';
    await friendRequest.save();

    res.json(friendRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
