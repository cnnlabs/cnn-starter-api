const { init } = require('./index.js'),
    myMiddleware = (req, res, next) => {
        res.setHeader('X-APP', 'API Starter Test');
        return next();
    };

let config = {
        flags: {
            graphiql: true
        },
        headers: {
            graphiql: '"X-Good": "Yes", "X-Wow": "Indeed"'
        },
        middleware: [
            myMiddleware
        ],
        paths: {
            foo: '/bar'
        },
    };

init(config);
