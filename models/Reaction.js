const mongoose = require('mongoose');

function dateFormat() {
    return (new Date()).toLocaleDateString();
}

const reactionSchema = new mongoose.Schema({
    reactionId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
        get: createdAtVal => dateFormat(createdAtVal)
    }
});

module.exports = reactionSchema;