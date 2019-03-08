const {buildSchema} = require('graphql');

const schema = buildSchema(`
    type Query {
        user(id: String!): User
        users(email: String): [User]
    }

    type Mutation {
        updateUserDisplayName(id: Int!, displayName: String!): User
    }

    type User {
        id: String
        displayName: String
        firstName: String
        lastName: String
        email: String
        isAD: Boolean
        ADAccount: String
        authLevel: String
        score: Int
        dateCreated: String
        lastLoggedIn: String
    }
`)

const getUser = (args) => {
    let id = args.id;
    return users.filter(user => {
        return user.id == id;
    })[0];
};


const getUsers = (args) => {
    if(args.email) {
        let email = args.email;
        return users.filter(user => user.email === email);
    } else {
        return users;
    }
};

const root = {
    user: getUser,
    users: getUsers,
    updateUserDisplayName: updateUserDisplayName,
}

module.exports = schema;