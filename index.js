const server = require('cnn-server'),
    cors = require('cors'),
    { makeExecutableSchema } = require('graphql-tools'),
    { graphqlExpress, graphiqlExpress } = require('apollo-server-express'),
    opticsAgent = require('optics-agent'),
    bodyParser = require('body-parser'),
    surrogateCacheControl = process.env.SURROGATE_CACHE_CONTROL || 'max-age=60, stale-while-revalidate=10, stale-if-error=6400',
    cacheControlHeader = process.env.CACHE_CONTROL || 'max-age=60',
    NoIntrospection = require('graphql-disable-introspection'),
    SigSci = new require('sigsci-module-nodejs'),
    enableSigSci = ((process.env.ENABLE_SIGSCI ? process.env.ENABLE_SIGSCI.toLowerCase() : 'false') === 'true'),
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
        executableSchema = makeExecutableSchema({
            typeDefs: schemas,
            resolvers: resolvers
        });

    let sigsciMiddleware = function sigsciMiddleware(req, res, next) {
        return next();
    }

    if (enableSigSci) {
        sigsciMiddleware = new SigSci({
            host: process.env.SIGSCI_AGENT_HOST,
            port: (process.env.SIGSCI_AGENT_PORT && parseInt(process.env.SIGSCI_AGENT_PORT, 10)) || 80,
            maxPostSize: (process.env.SIGSCI_MAX_POST_SIZE && parseInt(process.env.SIGSCI_MAX_POST_SIZE, 10)) || 100000,
            socketTimeout: (process.env.SIGSCI_TIMEOUT && parseInt(process.env.SIGSCI_TIMEOUT, 10)) || 100
        }).express();
    }

    const serverConfig = {
        logging: {
            console: {
                logLevel: 'info'
            }
        },
        enableCompression: true,
        middleware: [
            headerMiddleware,
            bodyParser.json(),
            sigsciMiddleware
        ],
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
