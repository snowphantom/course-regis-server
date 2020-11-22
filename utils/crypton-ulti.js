const md5 = require('md5');

module.exports.getMd5Hash = (text) => md5(text);
