// IMPORTS
const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema');

// GRAPHQL SETUP

// CREATING APP SERVER
const app = express();

app.use(
    '/graphql',
    expressGraphQL.graphqlHTTP({
        schema: schema,
        graphiql: true,
    })
);
app.listen(5000, () => console.log('Server is running...'));
