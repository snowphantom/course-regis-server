const config = require('config');
const queryService = require('./query-service');

const userCollectionName = config.get('database')['masterCollections']['userCollection'];

async function authenticate({username, password}) {
    const user = await getUser(username);
    
}

async function getUser(username) {
    return await queryService(userCollectionName, {find: {username}});
}

async function listUsers(query) {
    return await queryService(userCollectionName, query);
}

module.exports = {
    authenticate,
}