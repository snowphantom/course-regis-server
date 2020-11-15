const userService = require("../services/user-service");


async function authenticate(data) {
    userService.authenticate(data)
        .then(user => res.json(user))
        .catch(err =>  next(err));
}

async function listUsers(query) {
    
}

module.exports = {
    listUsers,
    authenticate,
}