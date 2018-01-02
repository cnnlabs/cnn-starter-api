const Query = `
    # Data API for CNN content
    type Query {
        # Returns the content
        getData(
            # The edition of the request (default = domestic)
            edition: String,
            # The content type of the request (e.g. section, article, etc)
            type: String,
            # [REQUIRED] The id of the content
            id: String!
        ): Data
    }
`;

module.exports = Query;
