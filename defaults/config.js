module.exports = {
    middleware: [],
    routes: {
        graphql: '/graphql',
        graphiql: '/graphiql'
    },
    resolvers: require('./resolvers'),
    schemas: require('./schemas')
};
