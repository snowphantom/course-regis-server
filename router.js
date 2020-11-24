const userController = require('./controllers/user-controller');
const courseController = require('./controllers/course-controller');
const registrationController = require('./controllers/registration-controller');
const logger = require('./infrastructure/winston-logger');
const ResponseException = require('./exceptions/response-exception');
const { authMiddleware, strictAuthMiddleWare, adminAuthMiddleWare } = require('./middleware/auth-middleware');

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
    app.post('/api/user/authenticate', userController.authenticate);
    app.post('/api/user/register', userController.createUser);
    app.get('/api/user/info', strictAuthMiddleWare, userController.getUser);
    app.get('/api/user/list', adminAuthMiddleWare, userController.listUsers);

    // course router
    app.get('/api/course/list', authMiddleware, courseController.listCourse);
    app.get('/api/course/info', authMiddleware, courseController.getCourse);
    
    app.post('/api/course/create', adminAuthMiddleWare, courseController.createCourse);
    app.put('/api/course/update', adminAuthMiddleWare, courseController.updateCourse);
    app.delete('/api/course/remove', adminAuthMiddleWare, courseController.removeCourse);

    // Registration router
    app.post('/api/registration/rollup', strictAuthMiddleWare, registrationController.rollup);
    app.post('/api/registration/rolloff', strictAuthMiddleWare, registrationController.rolloff);
    app.get('/api/registration/get-enroll', strictAuthMiddleWare, registrationController.getEnroll);
    
    app.get('/api/registration/list', adminAuthMiddleWare, registrationController.list);

    // 
};