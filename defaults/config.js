module.exports = {
    healthcheck: '/_healthcheck',
    routes: {
        graphql: '/graphql',
        graphiql: '/graphiql'
    },
    resolvers: require('./resolvers'),
    schemas: require('./schemas')
};
