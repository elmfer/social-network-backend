const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /.+@.+\..+/
  },
  thoughts: [{
    type: ObjectId,
    ref: 'Thought'
  }],
  friends: [{
    type: ObjectId,
    ref: 'User'
  }]
});

const User = mongoose.model('User', userSchema);

const handleError = function(err) { console.error(err); };

User.find({}).exec()
.then(collection => {
  if(collection.length > 0) return;

  User.create({
    username: "admin",
    email: "admin@mail.com"
  })
  .catch(handleError);
})

module.exports = User;