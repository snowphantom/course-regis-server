const userController = require('./controllers/user-controller');
const courseController = require('./controllers/course-controller');
const courseRegisController = require('./controllers/course-regis-controller');
const logger = require('./infrastructure/winston-logger');
const ResponseException = require('./exceptions/response-exception');

const controllerHandler = (promise, params) => async (req, res, next) => {
    const boundParams = params ? params(req, res, next) : [];
    try {
        const result = await promise(...boundParams);
        return res.json(result || {message: 'OK'});
    } catch(err) {
        logger.error(`API error: ${err.message}`, new ResponseException(err.stack));
        return res.status(500).json({status: 'error', message: err.message, stack: err.stack}) && next(err);
    }
};

const c = controllerHandler;

module.exports = (app) => {

    // user router
    app.get('/api/user/list', userController.listUsers);
    app.post('/api/user/authenticate', userController.authenticate);
    app.post('/api/user/register', userController.createUser);
    app.get('/api/user/info', userController.getUser);

    // course router
    app.post('/api/course/create', courseController.createCourse);
    app.get('/api/course/list', courseController.listCourse);
    app.get('/api/course/info', courseController.getCourse);
    app.put('/api/course/update', courseController.updateCourse);
    app.delete('/api/course/remove', courseController.removeCourse);

    // Register router
};