const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    parentQuestion: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
    },
    childrenComments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    text: {
        type: String,
        required: true
    },
    votes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdDate: {
        type: Date,
        required: true
    },
    lastEditedDate: {
        type: Date
    }
});

module.exports = mongoose.model('Comment', commentSchema);