const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    isAD: {
        type: Boolean,
        required: true
    },
    ADAccount: {
        type: String
    },
    authLevel: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    dateCreated: {
        type: Date,
        required: true
    },
    lastLoggedIn: {
        type: Date
    },
    createdQuestions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Question'
        }
    ],
    createdComments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
        }
    ]
});

module.exports = mongoose.model('User', userSchema);