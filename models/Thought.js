const mongoose = require('mongoose');

function dateFormat() {
  return (new Date()).toLocaleDateString();
}

const thoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // Use a getter method to format the timestamp on query
    get: createdAtVal => dateFormat(createdAtVal)
  },
  username: {
    type: String,
    required: true
  },
  // Use ReplySchema to validate data for a reply
  reactions: [ReactionSchema]
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;