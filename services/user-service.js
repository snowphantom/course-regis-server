const config = require('config');
const queryService = require('./query-service');
const { getMd5Hash } = require('../utils/crypton-ulti');
const AuthenticateException = require('../exceptions/authenticate-exception');
const mongoDbConnectionPool = require('./mongo-query-service');
const e = require('express');


const userCollectionName = config.get('database')['masterCollections']['userCollection'];

async function authenticate({username, password}) {
    const user = await getUser(username);
    const hashPassword = getMd5Hash(password.trim());

    if (user && user.password && user.password === hashPassword) {
        return user;
    } else {
        throw AuthenticateException("Your password isn't incorrect. Try again.");
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
    const lastModified = Date.now();
    let db = await mongoDbConnectionPool.get({});
    let updated = await db.collection(userCollectionName)
        .updateOne(
            {_id: user['_id']},
            {$set: Object.assign({}, user, {
                lastModified
            })},
            {upsert: true}
        );
    if (!updated || (updated.upsertedCount && updated.upsertedCount < 1)) {
        return;
    }

    return {...user, lastModified};
}

module.exports = {
    authenticate,
    getUser,
    listUsers,
    updateUser,
}