module.exports = {
    getData(obj, args, context, info) {
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
