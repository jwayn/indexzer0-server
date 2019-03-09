const bcrypt = require('bcryptjs');

const User = require('../models/user')
const Question = require('../models/question')
const Comment = require('../models/comment')


// Functions for heirarchy population

const questions = questionIds => {
    return Question.find({_id: {$in: questionIds}})
        .then(questions => {
            return questions.map(question => {
                return { 
                    ...question._doc,
                    _id: question.id,
                    author: user.bind(this, question.author)
                }
            });
        })
        .catch(err => {
            throw err
        });
}

const comments = commentIds => {
    return Comment.find({_id: {$in: commentIds}})
        .then(comments => {
            return comments.map(comment => {
                return {
                    ...comment._doc,
                    _id: comment.id,
                    author: user.bind(this, comment.author)
                }
            })
        })
}

const user = userId => {
    User.findById(userId)
        .then(user => {
            if(!user){
                throw new Error(`User doesn't exist.`);
            }
            return { 
                ...user._doc,
                _id: user.id,
                createdQuestions: questions.bind(this, user._doc.createdQuestions),
                createdComments: comments.bind(this, user._doc.createdComments)
            };
        }).catch(err => {
            throw err;
        });
}


// User API functions
const getUser = (args) => { 
    let id = args.id;
    return User.findById(id)
    .then(user => {
        return { 
            ...user._doc,
            _id: user._doc._id.toString(),
            createdQuestions: questions.bind(this, user._doc.createdQuestions),
            createdComments: comments.bind(this, user._doc.createdComments)
        };
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
        return { 
            ...question._doc,
            _id: question._doc._id.toString(),
            author: user.bind(this, question._doc.author)
        };
    })
    .catch(err => {
        throw err;
    })
}

const getQuestions = () => {
    return Question.find()
    .then(questions => {
        return questions.map(question => {
            return {
                ...question._doc,
                _id: question._doc._id.toString(),
                author: user.bind(this, question._doc.author)
            };
        });
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}


// TODO: Create get user questions resolver

// const getQuestionsByUser = args => {

// }


//Comment API Functions

const createComment = args => {
    comment = new Comment({
        author: args.commentInput.author,
        text: args.commentInput.text,
        parentQuestion: args.commentInput.parentQuestion,
        parentComment: args.commentInput.parentComment,
        createdDate: new Date().toISOString()
    });

    let createdComment;

    return comment
        .save()
        .then(result => {
            createdComment = { 
                ...result._doc, 
                _id: result._doc._id.toString(),
                parentQuestion: result._doc.parentQuestion,
                author: user.bind(this, result._doc.author)
            };
            
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
    let id = args.id;
    return Question.findById(id)
    .then(question => {
        return { 
            ...question._doc,
            _id: question._doc._id.toString(),
            author: user.bind(this, question._doc.author)
        };
    })
    .catch(err => {
        throw err;
    })
}

const getCommentsByQuestion = args => {
    let questionID = args.questionID;

    return Comment.find({parentQuestion: questionID})
    .then(comment => {
        return {
            ...comment._doc,
            _id: comment._doc._id.toString(),
            author: user.bind(this, comment._doc.author),
            childrenComments: comments.bind(this, comment._doc.childrenComments)
        }
    })
    .catch(err => {
        throw err;
    });
}

const getCommentsByUser = args => {
    let userID = args.userID;
    
    return Comment.find({author: userID})
    .then(comment => {
        return {
            ...comment._doc,
            _id: comment._doc._id.toString(),
            author: user.bind(this, comment._doc.author)
        }
    })
    .catch(err => {
        throw err;
    });
}

const getCommentsByParent = args => {
    let parentCommentID = args.parentCommentID;
    
    return Comment.find({parentComment: parentCommentID})
    .then(comment => {
        return {
            ...comment._doc,
            _id: comment._doc._id.toString(),
            author: user.bind(this, comment._doc.author)
        }
    })
    .catch(err => {
        throw err;
    });
}

const root = {
    createUser: createUser,
    users: getUsers,
    user: getUser,
    
    createQuestion: createQuestion,
    question: getQuestion,
    questions: getQuestions,
    
    createComment: createComment,
    comment: getComment,
    commentsByUser: getCommentsByUser,
    commentsByQuestion: getCommentsByQuestion,
    commentsByParent: getCommentsByParent
};

module.exports = root;