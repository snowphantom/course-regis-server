const courseService = require('../services/course-service');
const registrationService = require('../services/registration-service');

const rollup = async (req, res, next) => {
    const data = req.body;

    if (!data || !data.code || !data.username) {
        return res.json({
            success: false,
            message: `Your data was not fully. Please try again.`
        });
    }

    data['code'] = data.code.length > 0 && data.code.toUpperCase();

    const foundCourses = await courseService.getCourse([data.code]);
    if (foundCourses && foundCourses.length > 0) {
        const course = foundCourses[0];
    
        registrationService.updateRegistration(data, course)
            .then(data => {
                res.json({
                    success: true,
                    message: `User ${data.username} enroll ${course.code} successfully`,
                    data: [
                        data,
                    ]
                })
            })
            .catch(err => next(err));
    } else {
        return res.status(404).json({
            success: false,
            message: `Your data is not fully. Please try again`
        });
    }
};

const list = async (req, res, next) => {

};

module.exports = {
    rollup,
    list,
}