const config = require('config');
const logger = require('./winston-logger');

class AppManager {
    constructor() {
        this.init();
    }

    init() {

    }

    logInfo() {
        logger.info('App manager', {
            
        });
    }
}

module.exports = new AppManager();