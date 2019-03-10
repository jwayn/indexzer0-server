const graphql = require('graphql');

const bcrypt = require('bcryptjs');

const User = require('../models/user')
const Question = require('../models/question')
const Comment = require('../models/comment')

const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
    GraphQLList
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
        dateEdited: {type: GraphQLString},
        questions: {
            type: new GraphQLList(QuestionType),
            resolve(parent, args){
                // grab all questions with author id of this user id
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args){
                // grab all comments with author id of this user id
            }
        }
    })
});

const QuestionType = new GraphQLObjectType({
    name: 'Question',
    fields: () => ({
        id: {type: GraphQLID},
        author: {
            type: UserType,
            resolve(parent, args){
                // Grab author from users collection with parent.author
            }
        },
        title: {type: GraphQLString},
        text: {type: GraphQLString},
        tags: {type: GraphQLString},
        dateCreated: {type: GraphQLString},
        dateEdited: {type: GraphQLString},
        childrenComments: {
            type: newGraphQLList(CommentType),
            resolve(parent, args){
                //grab all comments with parent question of this question ID
            }
        }
    })
});

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: {type: GraphQLID},
        author: {
            type: UserType,
            resolve(parent, args){
                // Grab author from users collection with parent.author
            }
        },
        parentQuestion: {type: GraphQLString },
        parentComment: {type: GraphQLString},
        text: {type: GraphQLString},
        dateCreated: {type: GraphQLString},
        dateEdited: {type: GraphQLString},
        childrenComments: {
            type: newGraphQLList(CommentType),
            resolve(parent, args){
                //Grab comments with parentComment of this comment ID
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        Users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                // code to get all users
            }
        },
        OneUserByID: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                // Code to get one user from DB
            }
        },
        Questions: {
            type: new GraphQLList(QuestionType),
            resolve(parent, args){
                // code to get all questions
            }
        },
        OneQuestionByID: {
            type: QuestionType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                //code to get one question from DB based on ID
            }
        },
        OneCommentByID: {
            type: CommentType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                //code to get one comment by ID
            }
        }
    })
});

module.exports = new GraphQLSchema({
    query: RootQuery
})