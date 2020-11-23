const AuthenticateException = require('../exceptions/authenticate-exception');
const { verifyAuthToken } = require('../infrastructure/app-auth');

const authMiddleware = (req, res, next) => {
    if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')) {
        try {
            const { authorization } = Object.assign(req.headers, req.body, req.query);

            verifyAuthToken(authorization);
        } catch (err) {
            return res.status(401).json({
                error: {
                    message: err.message
                }
            });
        }
    } else {
        return res.status(401).json({
            error: {
                message: 'No token'
            }
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
                throw new AuthenticateException(`Your don't have permission.`)
            }
        } catch (err) {
            return res.status(401).json({
                success: false,
                error: {
                    message: err.message,
                },
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            error: {
                message: `No token`,
            },
        });
    }
    next();
    return;
};

const adminAuthMiddleWare = (req, res, next) => {
    if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')) {
        try {
            const { authorization } = Object.assign(req.headers, req.body, req.query);

            const payload = verifyAuthToken(authorization);
            const type = payload && payload.data && payload.data.type;
            if (!type || `${type}` !== '0') {
                throw new AuthenticateException(`Your don't have permission.`);
            }
        } catch (err) {
            throw new AuthenticateException(err.message)
        }
    } else {
        throw new AuthenticateException('No token');
    }
    next();
    return;
};

module.exports = {
    authMiddleware,
    strictAuthMiddleWare,
    adminAuthMiddleWare,
}