module.exports = (err, req, res, next) => {
    switch(err.exceptionType) {
        case 'ValidateException':
            return res.status(400).json({message: err.message});
        case 'UnauthorizedException':
            return res.status(401).json({message: err.message});
        default:
            // Server Error
            return res.status(500).json({message: err.message});
    }
}