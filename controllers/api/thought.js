const thoughtRouter = require('express').Router();
const { ObjectId } = require('mongodb');
const Thought = require('../../models/Thought');
const User = require('../../models/User');

thoughtRouter.get('/', async (req, res) => {
  try {
    const query = Thought.find({});
    const thoughts = await query.exec();

    res.status(200).json(thoughts);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

thoughtRouter.get('/:id', async (req, res) => {
  try {
    const query = Thought.findById(new ObjectId(req.params.id));
    const thought = await query.exec();

    // Return 404 if thought not found
    if(!thought) {
      res.status(404).json({ message: 'Thought not found.' });
      return;
    }

    res.status(200).json(thought);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

thoughtRouter.put('/:id', async (req, res) => {
  // Remove the username property from the request body
  if(req.body.username) {
    delete req.body.username;
  }

  try {
    let query = Thought.findByIdAndUpdate(new ObjectId(req.params.id), req.body);
    let thought = query.exec();

    // Return 404 if thought not found
    if(!thought) {
      res.status(404).json({ message: 'Thought not found.' });
      return;
    }

    query = Thought.findById(new ObjectId(req.params.id));
    thought = await query.exec();

    res.status(200).json(thought);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

thoughtRouter.delete('/:id', async (req, res) => {
  try {
    let query = Thought.findByIdAndDelete(new ObjectId(req.params.id));
    const thought = await query.exec();

    // Remove thought from user's thoughts array field
    query = User.findOne({ username: thought.username });
    const user = await query.exec();
    user.thoughts.pull(thought._id);
    await user.save(); 

    res.status(200).json(thought);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

thoughtRouter.post('/', async (req, res) => {
  if(!req.body.thoughtText || !req.body.username) {
    res.status(400).json({ message: "Body request must include 'thoughtText and 'username'." });
    return;
  }

  try {
    // Check if user exists
    let query = User.findOne({ username: req.body.username });
    const user = await query.exec();
    if(!user) {
      res.status(400).json({ message: "User does not exist." });
      return;
    }

    const thought = await Thought.create(req.body);

    // Add thought to user's thoughts array field
    user.thoughts.push(thought._id);
    await user.save();

    res.status(201).json(thought);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// For adding or removing reactions

thoughtRouter.post('/:id/reactions', async (req, res) => {
  try {
    // Make sure reaction follows schema
    if(!req.body.reactionBody || !req.body.username) {
      res.status(400).json({ message: "Body request must include 'reactionBody' and 'username'." });
      return;
    }

    const query = Thought.findByIdAndUpdate(new ObjectId(req.params.id), {
      $addToSet: { reactions: req.body }
    });
    const thought = await query.exec();

    res.status(200).json(thought);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

thoughtRouter.delete('/:id/reactions/:reactionId', async (req, res) => {
  try {
    const query = Thought.findByIdAndUpdate(new ObjectId(req.params.id), {
      $pull: { reactions: { _id: req.params.reactionId } }
    });
    const thought = await query.exec();

    res.status(200).json(thought);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = thoughtRouter;