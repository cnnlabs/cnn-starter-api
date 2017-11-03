const server = require('cnn-server'),
    cors = require('cors'),
    { makeExecutableSchema } = require('graphql-tools'),
    { graphqlExpress, graphiqlExpress } = require('apollo-server-express'),
    bodyParser = require('body-parser'),
    ObjectAssign = require('object-assign-deep'),
    surrogateCacheControl = process.env.SURROGATE_CACHE_CONTROL || 'max-age=30, stale-while-revalidate=10, stale-if-error=6400',
    cacheControlHeader = process.env.CACHE_CONTROL || 'no-cache',
    NoIntrospection = require('graphql-disable-introspection'),
    defaultConfig = require('./defaults/config.js')(),
    port = process.env.PORT || '5000';

const disableIntrospection = process.env.NO_INTROSPECTION === 'true';

const headerMiddleware = (req, res, next) => {
    res.setHeader('Cache-Control', cacheControlHeader);
    res.setHeader('Surrogate-Control', surrogateCacheControl);
    return next();
};

function init(appConfig) {
    const config = ObjectAssign({}, defaultConfig, appConfig),
        schemas = config.schemas || require('./defaults/schemas'),
        resolvers = config.resolvers || require('./defaults/resolvers'),
        executableSchema = config.executableSchema || makeExecutableSchema({
            typeDefs: schemas,
            resolvers: resolvers
        }),
        configRoutes = config.routes || [];

    // Flags
    const enableCors = config.flags.cors,
        enableGraphiql = config.flags.graphiql;

    let middleware = [
            headerMiddleware,
            bodyParser.json()
        ],
        routes = [
            {
                path: config.paths.graphql,
                handler: graphqlExpress(req => {
                    let graphqlConfig = {
                        schema: executableSchema
                    };

                    if (disableIntrospection) {
                        graphqlConfig.validationRules = [NoIntrospection];
                    }

                    return graphqlConfig;
                })
            },
            {
                path: config.paths.graphql,
                handler: graphqlExpress(req => {
                    let graphqlConfig = {
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
            path: config.paths.graphiql,
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
        middleware: middleware,
        routes: routes
    };

    server(serverConfig);
}

module.exports = { init };
