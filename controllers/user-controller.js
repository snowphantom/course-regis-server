const userService = require("../services/user-service");
const validateUltis = require('../utils/validate-ulti');
const { v4 : uuidv4 } = require('uuid');
const md5 = require('md5');

async function authenticate(req, res, next) {
    const { username, password } = req.body;
    userService.authenticate({username, password})
        .then(data => {
            delete data.password;
            delete data._id;
            res.json({
                success: true,
                message: 'Authenticate successfully',
                data: [
                    data
                ],
            })
        })
        .catch(err =>  {
            if (err.exceptionType === 'AuthenticateException') {
                res.status(401).send({
                    success: false,
                    message: err.message
                });
            } else next(err);
        });
}

async function listUsers(req, res, next) {
    userService.listUsers(req.body)
        .then(users => {
            res.json({
                success: true,
                message: 'Found',
                data: [...users]
            });
        })
        .catch(err => next(err));
}

async function getUser(req, res, next) {
    const {username} = req.body;
    let user = await userService.getUser(username);
    if (!user) {
        res.status(404).json({
            success: true,
            message: 'Not found'
        });
    } else {
        res.json({
            success: true,
            message: 'Found it',
            data: [
                user,
            ]
        })
    }
}

async function createUser(req, res, next) {
    let user = req.body;
    if (!user || user && user.length < 1) {
        return res.json({
            success: false,
            message: `Create user error. Please check your data.`
        });
    }

    if (!validateUltis.validateUsername(user.username) || !validateUltis.validatePassword(user.password)) {
        return res.json({
            success: false,
            message: `Your username or password doesn't OK`,
        });
    }

    let item = await userService.getUser(user.username)
    if (item) {
        return res.json({
            success: false,
            message: 'This username was taken. Please select another.',
        });
    }

    user['_id'] = uuidv4();
    user['state'] = 1;
    user['type'] = user['type'] !== undefined ? user['type'] : 1;
    user['password'] = user['password'] && md5(user['password']);
    userService.updateUser(user)
        .then(data => {
            res.json({
                success: true,
                message: 'Create user successfully.',
                data: [
                    data,
                ]
            });
        }).catch(err => next(err));
}

module.exports = {
    listUsers,
    authenticate,
    getUser,
    createUser,
}