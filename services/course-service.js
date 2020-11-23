const config = require('config');
const queryService = require('./query-service');
const mongoDbConnectionPool = require('./mongo-query-service');
const Exception = require('../exceptions/exception');
const { query } = require('winston');
const userController = require('../controllers/user-controller');

const courseCollectionName = config.get('database')['masterCollections']['courseCollection'];

async function listCourses(query) {
    query.skip = query && query.paging && query.paging * 50 || 0;
    query.limit = query && query.limit || 50;

    return await queryService(courseCollectionName, query);
};

async function updateCourse(course) {

    course['created_time'] = course['created_time'] || Date.now();
    const last_modified = Date.now();
    let db = await mongoDbConnectionPool.get({});
    let updated = await db.collection(courseCollectionName)
        .updateOne(
            {_id: course['_id']},
            {$set: Object.assign({}, course, {
                last_modified
            })},
            {upsert: true}
        );

    if (!updated || (updated.upsertedCount && updated.upsertedCount < 1)) {
        throw Exception('Update database failed.');
    }

    return {...course, last_modified};
}

async function getCourse(codes) {
    const foundCourse = await queryService(courseCollectionName, {find: {code: {$in: codes}}});
    return foundCourse;
}

async function removeCourse(code) {
    let db = await mongoDbConnectionPool.get({});
    await db.collection(courseCollectionName)
        .deleteOne({code});
}

module.exports = {
    listCourses,
    updateCourse,
    getCourse,
    removeCourse,
};