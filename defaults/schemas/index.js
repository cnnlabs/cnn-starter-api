const content = require('./content'),
    query = require('./query'),
    schema = `
        # we need to tell the server which types represent the root query
        # and root mutation types. We call them RootQuery and RootMutation by convention.
        schema {
          query: Query
        }
    `;

module.exports = [
    schema,
    query,
    content
];
