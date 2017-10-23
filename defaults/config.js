module.exports = {
    middleware: [],
    paths: {
        graphql: '/graphql',
        graphiql: '/graphiql'
    },
    routes: [
        {
            path: '/hello',
            handler: function (req, res, next) {
                res.send('Hello');
            }
        }
    ],
    resolvers: require('./resolvers'),
    schemas: require('./schemas')
};
