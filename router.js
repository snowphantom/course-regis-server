const userController = require('./controllers/user-controller');
const courseController = require('./controllers/course-controller');
const registrationController = require('./controllers/registration-controller');
const logger = require('./infrastructure/winston-logger');
const ResponseException = require('./exceptions/response-exception');
const { authMiddleware, strictAuthMiddleWare } = require('./middleware/auth-middleware');

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
    app.post('/api/course/create', authMiddleware, courseController.createCourse);
    app.get('/api/course/list', authMiddleware, courseController.listCourse);
    app.get('/api/course/info', authMiddleware, courseController.getCourse);
    app.put('/api/course/update', authMiddleware, courseController.updateCourse);
    app.delete('/api/course/remove', authMiddleware, courseController.removeCourse);

    // Registration router
    app.post('/api/registration/rollup', strictAuthMiddleWare, registrationController.rollup);
    app.post('/api/registration/list', strictAuthMiddleWare, registrationController.list);
    app.get('/api/registration/get-enroll', strictAuthMiddleWare, registrationController.getEnroll);

};