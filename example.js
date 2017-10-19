const server = require('./index.js');

server.init({
    routes: {
        graphql: '/graphql',
        graphiql: '/graphiql'
    }
});
