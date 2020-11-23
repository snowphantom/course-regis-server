const config = require('config');
const queryService = require('./query-service');
const mongoDbConnectionPool = require('./mongo-query-service');
const Exception = require('../exceptions/exception');
const { query } = require('winston');
const userController = require('../controllers/user-controller');

const registrationCollectionName = config.get('database')['masterCollections']['registrationCollection'];

async function listRegistration(query) {
    query.skip = query && query.paging && query.paging * 50 || 0;
    query.limit = query && query.limit || 50;

    return await queryService(registrationCollectionName, query);
};

async function updateRegistration(data, course) {

    data['created_time'] = data['created_time'] || Date.now();
    const last_modified = Date.now();
    let db = await mongoDbConnectionPool.get({});
    let updated = await db.collection(registrationCollectionName)
        .updateOne(
            {username: data['username']},
            {$push: {rolledup: {$each: [course]}}},
            {$set: Object.assign({}, data, {
                last_modified
            })},
            {upsert: true}
        );

    if (!updated || (updated.upsertedCount && updated.upsertedCount < 1)) {
        throw Exception('Update database failed.');
    }

    return {...data, last_modified};
}

async function getRegistrationByUsername(username) {
    const foundCourse = await queryService(registrationCollectionName, {find: {username: {$in: usernames}}});
    return foundCourse;
}

async function getRegistrationByCode(codes) {
    const foundCourse = await queryService(registrationCollectionName, {find: {code: {$in: codes}}});
    return foundCourse;
}

async function removeRegistration(code) {
    let db = await mongoDbConnectionPool.get({});
    await db.collection(registrationCollectionName)
        .deleteOne({code});
}

module.exports = {
    listRegistration,
    updateRegistration,
    getRegistrationByUsername,
    getRegistrationByCode,
    removeRegistration,
};