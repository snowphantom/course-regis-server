const { NotExtended } = require("http-errors");
const userService = require("../services/user-service");
const BSON = require('bson');
const validateUltis = require('../utils/validate-ulti');
const { v4 : uuidv4 } = require('uuid');

async function authenticate(data) {
    userService.authenticate(data)
        .then(user => res.json(user))
        .catch(err =>  {
            if (err.exceptionType === 'AuthenticateException') {
                res.status(401).send({
                    status: false,
                    message: err.message
                });
            } else next(err);
        });
}

async function listUsers(req, res, next) {
    return await userService.listUsers(req.body['query']);
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
    if (!user) {
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
            message: 'This username is taken. Please select another.',
        });
    }

    user['_id'] = uuidv4();
    user['state'] = 1;
    user['type'] = user['type'] ? user['type'] : 1,
    userService.updateUser(user)
        .then(data => {
            if (data) {
                res.json({
                        success: true,
                        message: 'Create user successfully.',
                        data: [
                            data,
                        ]
                    });
            } else {
                res.json({
                    success: false,
                    message: `Create user error. Please check your data.`
                });
            }
        }).catch(err => next(err));

    
}

module.exports = {
    listUsers,
    authenticate,
    getUser,
    createUser,
}