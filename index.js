const // server = require('cnn-server'),
    server = require('express')(),
    cors = require('cors'),
    graphQLTools = require('graphql-tools'),
    GraphQLServer = require('graphql-server-express'),
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
        schemas = require(config.schemasPath),
        resolvers = require(config.resolversPath),
        executableSchema = graphQLTools.makeExecutableSchema({
            typeDefs: schemas,
            resolvers: resolvers
        });

    if (enableSigSci) {
        sigsci = new SigSci({
            host: process.env.SIGSCI_AGENT_HOST,
            port: (process.env.SIGSCI_AGENT_PORT && parseInt(process.env.SIGSCI_AGENT_PORT, 10)) || 80,
            maxPostSize: (process.env.SIGSCI_MAX_POST_SIZE && parseInt(process.env.SIGSCI_MAX_POST_SIZE, 10)) || 100000,
            socketTimeout: (process.env.SIGSCI_TIMEOUT && parseInt(process.env.SIGSCI_TIMEOUT, 10)) || 100
        }).express();

        server.use(sigsci);
    }

    server.use(config.graphqlRoute,
        headerMiddleware,
        bodyParser.json(),
        GraphQLServer.graphqlExpress((req) => {
            let config = {
                schema: executableSchema,
                context: {
                    opticsContext: opticsAgent.context(req)
                }
            };

            if (disableIntrospection) {
                config.validationRules = [NoIntrospection];
            }

            return config;
        })
    );

    server.use(config.graphiqlRoute,
        GraphQLServer.graphiqlExpress({
            endpointURL: config.graphqlRoute,
            passHeader: `"${apiGatewayKeyName}": "${apiGatewayKey}"`
        })
    );

    server.listen(port, () => {
        console.log(`Server config:`)
        console.log(config);
        console.log(`Server is now running on PORT ${port}`);
    });
}

module.exports = {init};
