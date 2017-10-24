# CNN Starter API

An API starter package for CNN


## Initialize

```
const { init } = require('cnn-starter-api');

...

init();
```

## Default server config

```
{
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
    resolvers: require('./resolvers'),  // 'cnn-starter-api/defaults/resolvers'
    schemas: require('./schemas')       // 'cnn-starter-api/defaults/schemas'
}
```

The defaults can be overridden when initializing a server instance

```
const { init } = require('cnn-starter-api');

...

init({
    executableSchema: executableSchema,  // resolvers and schemas are ignored if this is set
    middleware: [
        myMiddleware
    ],
    paths: {
        graphql: '/my_graphql',
        graphiql: '/my_graphiql'
    },
    resolvers: require('./path/to/my/resolvers'),
    schemas: require('./path/to/my/schemas')
});
```

## Run the example

```
$ npm run test

> node example.js

2017-10-23T16:43:10.641Z - important: Initializing Logging subsystem...
2017-10-23T16:43:10.643Z - info: Running self check: info
2017-10-23T16:43:10.643Z - warn: Running self check: warn
2017-10-23T16:43:10.644Z - error: Running self check: error
2017-10-23T16:43:10.644Z - fatal: Running self check: fatal
2017-10-23T16:43:10.644Z - important: Running self check: important
2017-10-23T16:43:10.644Z - warn: NODE_ENV undefined should be one of production,development,staging,test
2017-10-23T16:43:10.683Z - important: Registering middleware: headerMiddleware
2017-10-23T16:43:10.684Z - important: Registering middleware: jsonParser
2017-10-23T16:43:10.684Z - important: Registering middleware: myMiddleware
2017-10-23T16:43:10.690Z - info: Registering route: path: /_healthcheck, method: get
2017-10-23T16:43:10.690Z - info: Registering route: path: /graphql, method: get
2017-10-23T16:43:10.690Z - info: Registering route: path: /graphql, method: post
2017-10-23T16:43:10.690Z - info: Registering route: path: /graphiql, method: get
2017-10-23T16:43:10.700Z - important: Service started on port: 5050
```


## Variables and overrides

#### API_GATEWAY_KEY

The key for the API Gateway

#### API_GATEWAY_KEYNAME

The key name for the API Gateway

#### CACHE_CONTROL (Browser caching)

default = max-age=60

#### NO_INTROSPECTION

default = true

#### SURROGATE_CACHE_CONTROL (Fastly Header)

default = max-age=60, stale-while-revalidate=10, stale-if-error=6400
