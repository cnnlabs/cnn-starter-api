# CNN Starter API

An API starter package for CNN


## Initialize

```
const server = require('cnn-starter-api');

...

server.init();
```

## Default server config

```
{
    healthcheck: '/_healthcheck',
    routes: {
        graphql: '/graphql',
        graphiql: '/graphiql'
    },
    resolvers: require('./resolvers'), // './defaults/resolvers'
    schemas: require('./schemas') // './defaults/schemas'
}
```

The defaults can be overridden when initializing a server instance

```
const server = require('cnn-starter-api');

...

server.init({
    routes: {
        graphql: '/my_graphql',
        graphiql: '/my_graphiql'
    },
    resolvers: require('./path/to/my/resolvers'),
    schemas: require('./path/to/my/schemas')
});
```


## Variables and overrides

#### API_GATEWAY_KEY

The key for the API Gateway

#### API_GATEWAY_KEYNAME

The key name for the API Gateway

#### CACHE_CONTROL (Browser caching)

default = max-age=60

#### ENABLE_SIGSCI (Controls the Signal Science module)

default = false

#### NO_INTROSPECTION

default = true

#### SIGSCI_AGENT_HOST

default = undefined

#### SIGSCI_AGENT_PORT

default = 80

#### SURROGATE_CACHE_CONTROL (Fastly Header)

default = max-age=60, stale-while-revalidate=10, stale-if-error=6400
