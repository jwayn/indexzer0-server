const express = require('express');
const bodyParser = require('body-parser')
const graphQLHttp = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./graphql/schema');

const app = express();

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphQLHttp({
        schema,
        graphiql: false
    })
);

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

