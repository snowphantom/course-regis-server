const Exception = require('./exception');

class ValidateException extends Exception {
    constructor(message) {
        super(message);
        this.exceptionType = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ValidateException;