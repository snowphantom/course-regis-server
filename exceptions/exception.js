class Exception extends Error {
    constructor(message) {
        super(message);
        this.Exception = message;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = Exception;