const config = require('config');
const queryService = require('./query-service');
const md5 = require('md5');
const AuthenticateException = require('../exceptions/authenticate-exception');
const mongoDbConnectionPool = require('./mongo-query-service');
const Exception = require('../exceptions/exception');
const jwt = require('jsonwebtoken');

const userCollectionName = config.get('database')['masterCollections']['userCollection'];

async function authenticate({username, password}) {
    const user = await getUser(username);
    const hashPassword = md5(password.trim());

    if (user && user.password === hashPassword) {
        const token = jwt.sign({
            data: {
                id: user['_id'],
                username: user['username'],
                state: user['state'],
                type: user['type'],
            }
        }, config.get('secretKey'), {expiresIn: '7d'});
        return {...user, token};
    } else {
        throw new AuthenticateException("Your username or password isn't incorrect. Try again.");
    }
}

async function getUser(username) {
    const foundUser = await queryService(userCollectionName, {find: {username}});
    return foundUser[0];
}

async function listUsers(query) {
    return await queryService(userCollectionName, query);
}

async function updateUser(user) {
    if (!user || !user._id) {
        return false;
    }

    user['created_time'] = user['created_time'] && true || Date.now();
    const last_modified = Date.now();
    let db = await mongoDbConnectionPool.get({});
    let updated = await db.collection(userCollectionName)
        .updateOne(
            {_id: user['_id']},
            {$set: Object.assign({}, user, {
                last_modified
            })},
            {upsert: true}
        );
    if (!updated || (updated.upsertedCount && updated.upsertedCount < 1)) {
        throw Exception('Update database failed.');
    }

    return {...user, last_modified};
}

module.exports = {
    authenticate,
    getUser,
    listUsers,
    updateUser,
}