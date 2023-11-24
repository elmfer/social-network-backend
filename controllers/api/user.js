const userRouter = require('express').Router();
const { ObjectId } = require('mongodb');
const User = require('../../models/User');
const Thought = require('../../models/Thought');

userRouter.get('/', async (req, res) => {
  try {
    const query = User.find({}).select(['-thoughts', '-friends']);
    const users = await query.exec();

    res.status(200).json(users);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.get('/:id', async (req, res) => {
  try {
    const query = User.findById(new ObjectId(req.params.id));
    const user = await query.exec();

    // Return 404 if user not found
    if(!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.status(200).json(user);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.put('/:id', async (req, res) => {
  try {
    let query = User.findByIdAndUpdate(new ObjectId(req.params.id), req.body);
    let user = query.exec();

    // Return 404 if user not found
    if(!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    query = User.findById(new ObjectId(req.params.id));
    user = await query.exec();

    res.status(200).json(user);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.delete('/:id', async (req, res) => {
  try {
    const query = User.findByIdAndDelete(new ObjectId(req.params.id));
    const user = await query.exec();

    // Return 404 if user not found
    if(!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    // Remove user's thoughts
    const thoughtQuery = Thought.deleteMany({ username: user.username });
    await thoughtQuery.exec();

    // Remove user from friends' friends array fields
    const friendQuery = User.updateMany({}, {
      $pull: { friends: user._id }
    });

    res.status(200).json(user);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.post('/', async (req, res) => {
  if(!req.body.username || !req.body.email) {
    res.status(400).json({ message: "Body request must include 'username' and 'email'." });
    return;
  }

  try {
    const user = await User.create(req.body);

    res.status(201).json(user);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// For adding or removing friends

userRouter.post('/:id/friends/:friendId', async (req, res) => {
  try {
    // Check if friend exists
    let query = User.findById(new ObjectId(req.params.friendId));
    let friend = await query.exec();
    if(!friend) {
      res.status(400).json({ message: "Friend does not exist." });
      return;
    }

    query = User.findByIdAndUpdate(new ObjectId(req.params.id), {
      $addToSet: { friends: req.params.friendId }
    });
    let user = await query.exec();

    // Return 404 if user not found
    if(!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.status(200).json(user);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.delete('/:id/friends/:friendId', async (req, res) => {
  try {
    const query = User.findByIdAndUpdate(new ObjectId(req.params.id), {
      $pull: { friends: req.params.friendId }
    });
    const user = await query.exec();

    res.status(200).json(user);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = userRouter;