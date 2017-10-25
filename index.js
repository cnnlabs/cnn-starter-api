const CNNServer = require('cnn-server');
const cors = require('cors');
const { makeExecutableSchema } = require('graphql-tools');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const opticsAgent = require('optics-agent');
const bodyParser = require('body-parser');
const NoIntrospection = require('graphql-disable-introspection');

const port = process.env.PORT || '5000';
const apiGatewayKey = process.env.API_GATEWAY_KEY;
const apiGatewayKeyName = process.env.API_GATEWAY_KEYNAME;
const disableIntrospection = process.env.NO_INTROSPECTION === 'true';
const surrogateCacheControl = process.env.SURROGATE_CACHE_CONTROL || 'max-age=60, stale-while-revalidate=10, stale-if-error=6400';
const cacheControlHeader = process.env.CACHE_CONTROL || 'max-age=60';

const headerMiddleware = (req, res, next) => {
    res.setHeader('Cache-Control', cacheControlHeader);
    res.setHeader('Surrogate-Control', surrogateCacheControl);
    return next();
};

const graphqlHandlerConf = req => {
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
}

class APIServer extends CNNServer {
    constructor(config) {
        super(config);
        this.schemas = this.config.api.schemas || require('./defaults/schemas');
        this.resolvers = this.config.api.resolvers || require('./defaults/resolvers');
        this.config.api.paths = this.config.api.paths || {
            graphql: '/graphql',
            graphiql: '/graphiql'
        },
        this.executableSchema = this.config.executableSchema || makeExecutableSchema({
            typeDefs: this.schemas,
            resolvers: this.resolvers
        });
        this.app.use(headerMiddleware);
        this.app.use(bodyParser.json());
        this.app.get(this.config.api.paths.graphql, graphqlExpress(graphqlHandlerConf));
        this.app.post(this.config.api.paths.graphql, graphqlExpress(graphqlHandlerConf));
        this.app.get(this.config.api.paths.graphiql, graphiqlExpress({
            endpointURL: this.config.api.paths.graphql,
            passHeader: `"${apiGatewayKeyName}": "${apiGatewayKey}"`
        });
    }
}

module.exports = APIServer;
