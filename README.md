# CNN Starter API

An API starter package for CNN


## Variables and overrides

### API_GATEWAY_KEY

The key for the API Gateway

### API_GATEWAY_KEYNAME

The key name for the API Gateway

### CACHE_CONTROL (Browser caching)

default = max-age=60

### ENABLE_SIGSCI (Controls the Signal Science module)

default = false

### NO_INTROSPECTION

default = true

### SIGSCI_AGENT_HOST

default = undefined

### SIGSCI_AGENT_PORT

default = 80

### SURROGATE_CACHE_CONTROL (Fastly Header)

default = max-age=60, stale-while-revalidate=10, stale-if-error=6400


## Default server config

```
{
    graphqlRoute: '/graphql',
    graphiqlRoute: '/graphiql',
    resolversPath: './defaults/resolvers',
    schemasPath: './defaults/schemas'
}
```

The defaults can be overridden when initializing a server instance

```
const server = require('cnn-starter-api');

...

server.init({
    graphqlRoute: '/my_graphql',
    graphiqlRoute: '/my_graphiql',
    resolversPath: './resolvers',
    schemasPath: './schemas'
});
```
