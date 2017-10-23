const { init } = require('./index.js'),
    myMiddleware = (req, res, next) => {
        res.setHeader('X-APP', 'API Starter Test');
        return next();
    };

let config = {
        middleware: [
            myMiddleware
        ]
    };

init(config);
