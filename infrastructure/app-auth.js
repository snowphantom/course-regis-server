const jwt = require('jsonwebtoken');
const config = require('config');
const AuthenticateException = require('../exceptions/authenticate-exception');

const decryptAuthToken = (token) => {
    try {
        const jwtToken = token.replace('Bearer', '').trim();

        let payload = null;
        
        payload = jwt.verify(jwtToken, config.get('secretKey'));

        return payload;
    } catch(err) {
        throw new AuthenticateException(err.message);
    }
};

const verifyAuthToken = async (token) => {
    try {
        const timeStampNow = Date.now();
        const jwtPayload = decryptAuthToken(token);
    
        return jwtPayload;
    } catch(err) {
        throw err;
    }
};

module.exports = {
    verifyAuthToken,
}