# CNN GraphQL API

A GraphQL API server that extends [CNN Server](http://github.com/cnnlabs/cnn-server)

## Running

```
const APIServer = require('cnn-starter-api');
const apiServer = new APIServer(config);

apiServer.start();

```

## Config

See documentation for [CNN Server](http://github.com/cnnlabs/cnn-server) for the basic config options.

An optional `api` property can be provided to the config to change the urls for graphql and graphiql. Defaults are:

```
api: {
    graphql: '/graphql',
    graphiql: '/graphiql'
}
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
