const server = require('cnn-server'),
    cors = require('cors'),
    { makeExecutableSchema } = require('graphql-tools'),
    { graphqlExpress, graphiqlExpress } = require('apollo-server-express'),
    bodyParser = require('body-parser'),
    surrogateCacheControl = process.env.SURROGATE_CACHE_CONTROL || 'max-age=30, stale-while-revalidate=10, stale-if-error=6400',
    cacheControlHeader = process.env.CACHE_CONTROL || 'no-cache',
    NoIntrospection = require('graphql-disable-introspection'),
    defaultConfig = require('./defaults/config.js')();

const disableIntrospection = process.env.NO_INTROSPECTION === 'true';

const headerMiddleware = (req, res, next) => {
    res.setHeader('Cache-Control', cacheControlHeader);
    res.setHeader('Surrogate-Control', surrogateCacheControl);
    return next();
};

function init(appConfig) {
    const config = Object.assign({}, defaultConfig, appConfig),
        schemas = config.schemas || require('./defaults/schemas'),
        resolvers = config.resolvers || require('./defaults/resolvers'),
        executableSchema = config.executableSchema || makeExecutableSchema({
            typeDefs: schemas,
            resolvers: resolvers
        }),
        context = config.context || {};
        configRoutes = config.routes || [];

    // Flags
    const enableCors = config.enableCors,
        enableGraphiql = config.enableGraphiql,
        enableStatic = config.enableStatic;

    let middleware = [
            headerMiddleware,
            bodyParser.json()
        ],
        routes = [
            {
                path: config.paths.graphql || 'graphql',
                handler: graphqlExpress(() => {
                    let graphqlConfig = {
                        context: context,
                        schema: executableSchema
                    };

                    if (disableIntrospection) {
                        graphqlConfig.validationRules = [NoIntrospection];
                    }

                    return graphqlConfig;
                })
            },
            {
                path: config.paths.graphql || '/graphql',
                handler: graphqlExpress(() => {
                    let graphqlConfig = {
                        context: context,
                        schema: executableSchema
                    };

                    if (disableIntrospection) {
                        graphqlConfig.validationRules = [NoIntrospection];
                    }

                    return graphqlConfig;
                }),
                method: 'post'
            }
        ];

    if (enableGraphiql) {
        routes.push({
            path: config.paths.graphiql || '/graphiql',
            handler: graphiqlExpress({
                endpointURL: config.paths.graphql,
                passHeader: config.headers.graphiql
            })
        });
    }

    for (let i = 0; i < configRoutes.length; i++) {
        routes.push(configRoutes[i]);
    }

    // Add middleware
    if (enableCors) {
        middleware.push(cors({ origin: '*' }));
    }
    for (let i = 0; i < config.middleware.length; i++) {
        middleware.push(config.middleware[i]);
    }

    const serverConfig = {
        logging: {
            console: {
                logLevel: 'info'
            }
        },
        enableCompression: true,
        enableStatic: enableStatic,
        middleware: middleware,
        routes: routes
    };

    server(serverConfig);
}

module.exports = { init };
