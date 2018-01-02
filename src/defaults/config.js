module.exports = () => {
    let config = {
            enableCors: true,
            enableGraphiql: ((process.env.ENABLE_GRAPHIQL ? process.env.ENABLE_GRAPHIQL.toLowerCase() : '') === 'true'),
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

    return config;
};
