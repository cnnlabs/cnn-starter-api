module.exports = {
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
