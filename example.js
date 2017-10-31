const { init } = require('./index.js'),
    myMiddleware = (req, res, next) => {
        res.setHeader('X-APP', 'API Starter Test');
        return next();
    };

let config = {
        headers: {
            graphiql: '"X-Good": "Yes", "X-Wow": "Indeed"'
        },
        middleware: [
            myMiddleware
        ]
    };

init(config);
