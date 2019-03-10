const graphql = require('graphql');

const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');

const User = require('../models/user')
const Question = require('../models/question')
const Comment = require('../models/comment')
const Tag = require('../models/tag')

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
            type: new GraphQLList(CommentType),
            resolve(parent, args){
                //grab all comments with parent question of this question ID
            }
        },
        tags: {
            type: new GraphQLList(TagType),
            resolve(parent, args){

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
            type: new GraphQLList(CommentType),
            resolve(parent, args){
                //Grab comments with parentComment of this comment ID
            }
        }
    })
});

const TagType = new GraphQLObjectType({
    name: 'Tag',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        slug: {type: GraphQLString}
    })
})

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

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                email: {type: GraphQLString},
                displayName: {type: GraphQLString},
                password: {type: GraphQLString}
            },
            resolve(parent, args){

            }
        },
        createQuestion: {
            type: QuestionType,
            args: {
                summary: {type: GraphQLString},
                description: {type: GraphQLString},
                author: {type: GraphQLID},
                resolve(parent, args){

                }
            }
        },
        createComment: {
            type: CommentType,
            args: {
                text: {type: GraphQLString},
                author: {type: GraphQLString}
            },
            resolve(parent, args){

            }
        },
        createTag: {
            type: TagType,
            args: {
                name: {type: GraphQLString}
            },
            async resolve(parent, args){
                try{
                    const tag = await Tag.findOne( {name: args.name} )
                    if(!tag){
                        let newTag = await new Tag({
                            name: args.name,
                            slug: randomstring.generate(6)
                        })
                        return await newTag.save()
                    }
                    throw new Error('Tag already exists.');
                }
                catch (err) {
                    throw err;
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})