module.exports = {
    healthcheck: '/_healthcheck',
    routes: {
        graphql: '/graphql',
        graphiql: '/graphiql'
    },
    paths: {
        resolvers: './defaults/resolvers',
        schemas: './defaults/schemas'
    }
};
