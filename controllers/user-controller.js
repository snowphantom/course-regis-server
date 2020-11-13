const userService = require("../services/user-service");


async function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(err =>  next(err));
}

module.exports = {
    authenticate,
}