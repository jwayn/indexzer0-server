const { buildSchema } = require('graphql');

module.exports = buildSchema(`
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
        createdQuestions: [Question!]
        createdComments: [Comment!]
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