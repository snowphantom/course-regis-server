const winston = require('winston');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const config = require('config');
const { all } = require('../app');

const logDir = 'log';
const logsPath = path.join(logDir, '/all.log');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logFilePattern = global.logFilePattern || '/all.log';

const transports = [
    new DailyRotateFile({
        filename: path.join(logDir, logFilePattern),
        datePattern: 'yyyy-MM-dd.',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '10',
        level: 'info'
    }),
];

const exceptionHandlers = [
    new DailyRotateFile({
        filename: path.join(logDir, '/all-errors.log'),
        datePattern: 'yyyy-MM-dd.',
        prepend: true,
        maxFiles: '10',
        maxDays: '10',
        zippedArchive: true,
        level: 'info'
    }),
];

module.exports = {
    transports,
    exceptionHandlers,
}
