module.exports = {
    routes: {
        graphql: '/graphql',
        graphiql: '/graphiql'
    },
    resolvers: require('./resolvers'),
    schemas: require('./schemas')
};
