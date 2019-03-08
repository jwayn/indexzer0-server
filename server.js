const express = require('express');
const bodyParser = require('body-parser')
const graphQLHttp = require('express-graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const User = require('./models/user')
const Question = require('./models/question')
const Comment = require('./models/comment')

const app = express();

app.use(bodyParser.json());

const {buildSchema} = require('graphql');


// User API functions
const getUser = (args) => {
    let id = args.id;
    return users.filter(user => {
        return user.id == id;
    })[0];
};

const getUsers = () => {
    return User.find()
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
    return questions.filter(question => {
        return question.id == id;
    })[0];
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
    return null
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
    
    createComment: createComment,
    comment: getComment
};

const schema = buildSchema(`
    type RootQuery {
        users: [User!]!
        user(id: String!): User!
        question(id: String!): Question!
        comment(id: String!): Comment!
    }

    type RootMutation {
        createUser(userInput: UserInput): User
        createQuestion(questionInput: QuestionInput): Question
        createComment(commentInput: CommentInput): Comment
    }

    input UserInput {
        email: String!
        password: String!
        displayName: String!
        authLevel: String!
        isAD: Boolean!
        ADAccount: String
    }

    type User {
        _id: ID!
        email: String!
        password: String
        displayName: String!
        firstName: String
        lastName: String
        isAD: Boolean!
        ADAccount: String
        authLevel: String
        score: Int
        dateCreated: String
        lastLoggedIn: String
    }

    input QuestionInput {
        author: String!
        text: String!

    }

    type Question {
        _id: ID!
        author: User!
        text: String!
        createdDate: String!
        lastEditedDate: String
        childrenComments: [Comment!]!
        answer: Comment
        votes: [User!]
        watchers: [User!]!
    }

    input CommentInput {
        author: String!
        text: String!
        parentQuestion: String!
    }

    type Comment {
        _id: ID!
        author: User!
        text: String!
        parentQuestion: Question!
        createdDate: String!
        lastEditedDate: String
        ChildrenComments: [Comment!]!
        votes: [User!]
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

app.use('/graphql', graphQLHttp({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
        process.env.MONGO_PASSWORD
    }@cluster0-70olz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
    .then(() => {
        app.listen(4000, () => {
            console.log('Express graphql server is running on http://localhost:4000/graphql.');
        });
    })
    .catch(err => {
        console.log(err);
    });

