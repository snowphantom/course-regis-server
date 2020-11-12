const { transports } = require('winston');
const winston = require('winston');
const {transports, exceptionHandlers} = require('./log-transports');
const os = require('os');

const logger = winston.createLogger({
    transports: transports,
    exceptionHandlers: exceptionHandlers
});

const osInfo = () => {
    return {
        MachineName: os.hostname(),
        MemoryUsage: process.memoryUsage()
    }
};

const loggerWrapper = {
    info: (message, meta, context) => {
        logger.info(message, {
            MessageTemplate: {...(context || {}), ...(meta || {}), Description: message},
            Properties: osInfo()
        })
    },
    error: (message, ex, context) => {
        logger.error(message, {
            ...(ex || {}),
            MessageTemplate: {...(context || {})},
            Properties: osInfo()
        })
    }
}

module.exports = loggerWrapper;