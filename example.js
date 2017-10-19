const server = require('./index.js');

server.init({
    routes: [
        {
            path: '/baz',
            handler: (req, res) => res.send('Hello World!')
        }
    ]
});
