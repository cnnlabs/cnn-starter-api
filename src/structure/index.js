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
        configRoutes = config.routes || [];
    const contextPerRequest = config.contextPerRequest || {};

    console.log('CNN_STARTER_API:  INIT');
    console.log('CNN_STARTER_API:  contextPerRequest: ', contextPerRequest);
    console.log('YES')

    // Flags
    const enableCors = config.enableCors,
        enableGraphiql = config.enableGraphiql,
        enableStatic = config.enableStatic;

    const basicRoute = {
        path: config.paths.graphql || 'graphql',
        handler: graphqlExpress((req, res) => {
            let graphqlConfig = {
                context: contextPerRequest(req, res),
                // context: {
                //     addSurrogateKeys: ((keys) => (x) => {
                //         console.log(`\nWOOHOO!!  req.surrogateKeys: ${req.surrogateKeys}`);
                //         console.log(`\nWOOHOO!!  addSurrogateKeys: ${x}`);
                //         // Expects array or string or number
                //         keys.push(x);
                //         console.log(`      ---> side-effect --> new keys --> ${keys}\n`);
                //     })(req.surrogateKeys)
                // },
                formatResponse: (response, {context}) => {
                    console.log(' \n--- +++ --- +++ --- formatResponse\n')
                    console.log(`response keys: [${Object.keys(response)}]`);
                    console.log(`context keys:  [${Object.keys(context)}]`)
                    //response.setHeader('foo', 'BAAAAAAAAAR')
                    return response;
                },
                schema: executableSchema
            };

            if (disableIntrospection) {
                graphqlConfig.validationRules = [NoIntrospection];
            }

            return graphqlConfig;
        })
    }

    const routes = ['get', 'post'].map(meth => Object.assign({}, basicRoute, {method: meth}));

    let middleware = [
            headerMiddleware,
            bodyParser.json()
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
