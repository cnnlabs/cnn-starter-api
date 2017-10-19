module.exports = {
    healthcheck: '/_healthcheck',
    routes: {
        graphql: '/graphql',
        graphiql: '/graphiql'
    },
    paths: {
        resolvers: require('./resolvers'),
        schemas: require('./schemas')
    }
};
