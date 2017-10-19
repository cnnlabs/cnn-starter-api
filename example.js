const server = require('./index.js');

server.init({
    graphqlRoute: '/my_graphql',
    graphiqlRoute: '/my_graphiql'
});
