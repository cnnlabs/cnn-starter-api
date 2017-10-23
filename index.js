const server = require('cnn-server'),
    cors = require('cors'),
    { makeExecutableSchema } = require('graphql-tools'),
    { graphqlExpress, graphiqlExpress } = require('apollo-server-express'),
    opticsAgent = require('optics-agent'),
    bodyParser = require('body-parser'),
    surrogateCacheControl = process.env.SURROGATE_CACHE_CONTROL || 'max-age=60, stale-while-revalidate=10, stale-if-error=6400',
    cacheControlHeader = process.env.CACHE_CONTROL || 'max-age=60',
    NoIntrospection = require('graphql-disable-introspection'),
    defaultConfig = require('./defaults/config.js'),
    port = process.env.PORT || '5000',
    apiGatewayKey = process.env.API_GATEWAY_KEY,
    apiGatewayKeyName = process.env.API_GATEWAY_KEYNAME;

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
        });

    let middleware = [
        headerMiddleware,
        bodyParser.json()
    ];

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
        routes: [
            {
                path: config.routes.graphql,
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
                path: config.routes.graphql,
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
                path: config.routes.graphiql,
                handler: graphiqlExpress({
                    endpointURL: config.routes.graphql,
                    passHeader: `"${apiGatewayKeyName}": "${apiGatewayKey}"`
                })
            }
        ]
    };

    server(serverConfig);
}

module.exports = { init };
