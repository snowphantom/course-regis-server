const jwt = require('jsonwebtoken');
const config = require('config');
const AuthenticateException = require('../exceptions/authenticate-exception');

const decryptAuthToken = async (token) => {
    const jwtToken = token.replace('Bearer', '').trim();

    let payload = null;

    try {
        payload = jwt.verify(jwtToken, config.get('secretKey'));
    } catch(err) {
        throw new AuthenticateException(err.message);
    }

    return payload;
};

const verifyAuthToken = async (token) => {
    const timeStampNow = Date.now();
    const jwtPayload = await decryptAuthToken(token);
    
    return jwtPayload;
};

module.exports = {
    verifyAuthToken,
}