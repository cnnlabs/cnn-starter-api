module.exports = {
    getData(obj, args) {
        let edition = args.edition || 'domestic',
            type = args.type || 'section',
            id = args.id || '_thisId';

        return {
            edition: edition,
            type: type,
            id: id,
            object: {data: {brand: 'CNN'}}
        };
    }
};
