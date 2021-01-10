const AuthenticateException = require('../exceptions/authenticate-exception');
const { verifyAuthToken } = require('../infrastructure/app-auth');

const authMiddleware = async (req, res, next) => {
    if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')) {
        try {
            const { authorization } = Object.assign(req.headers, req.body, req.query);

            await verifyAuthToken(authorization);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: err.message
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: 'No token'
        });
    }
    next();
    return;
};

const strictAuthMiddleWare = async (req, res, next) => {
    if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')) {
        try {
            const { authorization, username } = Object.assign(req.headers, req.body, req.query);

            const payload = await verifyAuthToken(authorization);
            const usernameSaved = payload && payload.data && payload.data.username;
            if (!(username && usernameSaved && username === usernameSaved)) {
                throw new AuthenticateException(`You don't have permission or your data isn't fully.`)
            }
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: err.message,
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: `No token`,
        });
    }
    next();
    return;
};

const adminAuthMiddleWare = async (req, res, next) => {
    if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')) {
        try {
            const { authorization } = Object.assign(req.headers, req.body, req.query);

            const payload = await verifyAuthToken(authorization);
            const type = payload && payload.data && payload.data.type;
            if (typeof type === 'undefined' || `${type}` !== '0') {
                throw new AuthenticateException(`You don't have permission.`);
            }
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: err.message,
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: `No token`,
        });
    }
    next();
    return;
};

module.exports = {
    authMiddleware,
    strictAuthMiddleWare,
    adminAuthMiddleWare,
}