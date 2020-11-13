const Exception = require('./exception');

class UnauthorizedException extends Exception {
    constructor(message) {
        super(message);
        this.exceptionType = this.constructor.name;
        Error.stackTraceLimit(this, this.constructor);
    }
}

module.exports = UnauthorizedException;