const { init } = require('./src/graphql/structure/index.js'),
    myMiddleware = (req, res, next) => {
        res.setHeader('X-APP', 'API Starter Test');
        return next();
    };

let config = {
        enableGraphiql: true,
        headers: {
            graphiql: '"X-Good": "Yes", "X-Wow": "Indeed"'
        },
        middleware: [
            myMiddleware
        ]
    };

init(config);
