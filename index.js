const server = require('cnn-server'),
    cors = require('cors'),
    { makeExecutableSchema } = require('graphql-tools'),
    { graphqlExpress, graphiqlExpress } = require('apollo-server-express'),
    opticsAgent = require('optics-agent'),
    bodyParser = require('body-parser'),
    surrogateCacheControl = process.env.SURROGATE_CACHE_CONTROL || 'max-age=30, stale-while-revalidate=10, stale-if-error=6400',
    cacheControlHeader = process.env.CACHE_CONTROL || 'no-cache',
    NoIntrospection = require('graphql-disable-introspection'),
    defaultConfig = require('./defaults/config.js'),
    port = process.env.PORT || '5000';

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
        configRoutes = config.routes || [];

    let middleware = [
            headerMiddleware,
            bodyParser.json(),
            cors({ origin: '*' })
        ],
        routes = [
            {
                path: config.paths.graphql,
                handler: graphqlExpress(req => {
                    let graphqlConfig = {
                        schema: executableSchema,
                        context: {
                            opticsContext: opticsAgent.context(req)
                        }
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
                        schema: executableSchema,
                        context: {
                            opticsContext: opticsAgent.context(req)
                        }
                    };

                    if (disableIntrospection) {
                        graphqlConfig.validationRules = [NoIntrospection];
                    }

                    return graphqlConfig;
                }),
                method: 'post'
            },
            {
                path: config.paths.graphiql,
                handler: graphiqlExpress({
                    endpointURL: config.paths.graphql,
                    passHeader: config.headers.graphiql
                })
            }
        ];

    for (let i = 0; i < configRoutes.length; i++) {
        routes.push(configRoutes[i]);
    }

    // Add middleware
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
