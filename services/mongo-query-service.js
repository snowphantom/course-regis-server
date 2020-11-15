const config = require('config');
const e = require('express');
const logger = require('../infrastructure/winston-logger');
const MongoClient = require('mongodb').MongoClient;
const sleep = require('../utils/sleep-util').sleep;

let isConnecting = false;
const dbGroups = config.get('database')['dbgroups'];
const globalDbStack = [];

module.exports.get = async (params) => {
    let i = 1;
    // avoid multiple connections to same database 
    while(i <= 10 && isConnecting) {
        await sleep(3 * 1000);
        i++;
    }

    isConnecting = true;

    try {
        let group, dbUrl, dbName, dbOptions;

        group = params && params.group;

        if (group) {
            group = `${group}`;
            dbUrl = dbGroups.find(g => `${g.group}` === group).url;
            dbName = dbGroups.find(g => `${group}` === group).dbname;
            dbOptions = dbgroups.find(g => `${group}` === group).options;
        } else {
            group = 'master';
            dbUrl = config.get('database')['masterUrl'];
            dbName = config.get('database')['masterDbname'];
            dbOptions = config.get('database')['masterDboptions'];
        }

        if (globalDbStack[group]) {
            isConnecting = false;
            return globalDbStack[group];
        }

        return MongoClient.connect(dbUrl, Object.assign(
            {
                useNewUrlParser: true,
                poolSize: 1,
                reconnectTries: Number.MAX_VALUE,
                connectTimeoutMS: 5000,
                socketTimeoutMS: 60000,
                maxTimeMS: 30000,
                autoReconnect: true,
                reconnectInterval: 30 * 1000 // Reconnect every 30s
            }, dbOptions || {}))
            .then((client) => {
                isConnecting = false;
                console.log(`Connecting successfully to db ${group}.${dbname} ${dbUrl} ${dbOptions}. Request from ${JSON.stringify(params)}`);
                globalDbStack[group] = client.db(dbname);
                return globalDbStack[group];
            })
            .catch((err) => {
                isConnecting = false;
                console.log(`Error connecting to db ${group}.${dbname} ${dbUrl} ${dbOptions}. Request from ${JSON.stringify(params)}`);
            })
    } catch(err) {
        isConnecting = false;
        console.log(err);
        throw e;
    }
}