const bcrypt = require('bcryptjs');

const User = require('../models/user')
const Question = require('../models/question')
const Comment = require('../models/comment')

// User API functions
const getUser = (args) => {
    let id = args.id;
    return User.findById(id).populate()
    .then(user => {
        return { ...user._doc, _id: user._doc._id.toString() };
    })
    .catch(err => {
        throw err;
    })
};

const getUsers = () => {
    return User.find().populate()
    .then(users => {
        return users.map(user => {
            return { ...user._doc, _id: user._doc._id.toString()};
        })
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
}

const createUser = args => {
    return User.findOne( { email: args.userInput.email })
    .then(user => {
        if(user) {
            throw new Error('User already exists.');
        }
        return bcrypt
        .hash(args.userInput.password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: args.userInput.email,
                displayName: args.userInput.displayName,
                password: hashedPassword,
                isAD: args.userInput.isAD,
                ADAccount: args.userInput.ADAccount,
                authLevel: args.userInput.authLevel,
                dateCreated: new Date().toISOString()
            })
            return user.save();
        }).then(result => {
            return { ...result._doc, password: null, _id: result.id }
        }).catch(err => {
            throw(err);
        })
    })
};

//Question API Functions
const createQuestion = args => {
    question = new Question({
        author: args.questionInput.author,
        text: args.questionInput.text,
        createdDate: new Date().toISOString()
    });

    let createdQuestion;

    return question
        .save()
        .then(result => {
            createdQuestion = { ...result._doc, id: result._doc._id.toString() };
            return User.findById(args.questionInput.author)
        })
        .then(user => {
            if (!user) {
                throw new Error(`User doesn't exist`)
            }
            user.createdQuestions.push(question);
            return user.save()
        })
        .then(result => {
            return createdQuestion;
        })
        .catch(err => {
            console.log(err);
            throw(err);
        })
}

const getQuestion = args => {
    let id = args.id;
    return Question.findById(id).populate()
    .then(question => {
        return { ...question._doc, _id: question._doc._id.toString() };
    })
    .catch(err => {
        throw err;
    })
}

const getQuestions = args => {
    return Question.find(args._id)
    .then(questions => {
        return questions.map(question => {
            return { ...question._doc, _id: question._doc._id.toString()};
        })
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
}

//Comment API Functions

const createComment = args => {
    comment = new comment({
        author: args.commentInput.author,
        text: args.commentInput.text,
        createdDate: new Date().toISOString()
    });

    let createdComment;

    return comment
        .save()
        .then(result => {
            createdComment = { ...result._doc, id: result._doc._id.toString() };
            return User.findById(args.commentInput.author)
        })
        .then(user => {
            if (!user) {
                throw new Error(`User doesn't exist`)
            }
            user.createdComments.push(comment);
            return user.save()
        })
        .then(result => {
            return createdComment;
        })
        .catch(err => {
            console.log(err);
            throw(err);
        })
}

const getComment = args => {
    return null
}

const root = {
    createUser: createUser,
    users: getUsers,
    user: getUser,
    
    createQuestion: createQuestion,
    question: getQuestion,
    questions: getQuestions,
    
    createComment: createComment,
    comment: getComment
};

module.exports = root;