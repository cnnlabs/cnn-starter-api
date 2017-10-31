module.exports = {
    headers: {
        graphiql: '"X-Starter-API": "Started"'
    },
    middleware: [],
    paths: {
        graphql: '/graphql',
        graphiql: '/graphiql'
    },
    routes: [
        {
            path: '/',
            handler: function (req, res, next) {
                res.send('Hello');
            }
        }
    ],
    resolvers: require('./resolvers'),
    schemas: require('./schemas')
};
