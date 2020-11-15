const mongoDbConnectionPool = require('./mongo-query-service');

module.exports = async (collection, query) => {
    var skip = query && query['skip'] || 0;
    var limit = Math.min(query && query['limit'] || 20, 1000);
    var sort = query && query['sort'] || {'created_time' : -1};
    var fields = query && query['fields'] || {};
    
    var find = query && query['find'] || {};
    let db = await mongoDbConnectionPool.get({});
    return db.collection(collection)
        .find(find)
        .project(fields)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();
};