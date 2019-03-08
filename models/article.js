const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
    },
    watchers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

module.exports = mongoose.model('Question', questionSchema);