const { buildSchema } = require('graphql');
const graphql = require('graphql');

const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLID},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        displayName: {type: GraphQLString},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        isAD: {type: GraphQLBoolean},
        ADAccount: {type: GraphQLString},
        authLevel: {type: GraphQLString},
        score: {type: GraphQLInt},
        dateCreated: {type: GraphQLString},
        dateEdited: {type: GraphQLString}
    })
});

const QuestionType = new GraphQLObjectType({
    name: 'Question',
    fields: () => ({
        id: {type: GraphQLID},
        author: {type: UserType},
        text: {type: GraphQLString},
        dateCreated: {type: GraphQLString},
        dateEdited: {type: GraphQLString}
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        OneUserByID: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                // Code to get one user from DB
            }
        },
        OneUserByEmail: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                //code to get one user from DB
            }
        },
        OneQuestionByID: {
            type: QuestionType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {

            }
        },
        AllQuestionsByUserID: {
            type: QuestionType,
            args: {userID: {type: GraphQLString}},
            resolve(parent, args){

            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: RootQuery
})

/*
module.exports = buildSchema(`
    type RootQuery {
        users: [User!]!
        user(id: String!): User!
        question(id: String!): Question!
        questions: [Question!]!
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
        parentComment: String
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

*/