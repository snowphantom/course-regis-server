const courseService = require('../services/course-service');
const registrationService = require('../services/registration-service');

const rollup = async (req, res, next) => {
    let data = req.body;

    if (!data || !data.code || !data.username) {
        return res.json({
            success: false,
            message: `Your data was not fully. Please try again.`
        });
    }
    const courseCode = data.code.length > 0 && data.code.toUpperCase();
    delete data.code;

    const enroll = await registrationService.getEnrollByUsername([data.username]);
    if (enroll.enrolled && enroll.enrolled.filter(e => e.code === courseCode).length > 0) {
        return res.json({
            success: false,
            message: `Course ${courseCode} was enrolled.`
        })
    }
    enroll['enrolled'] = enroll.enrolled || [];
    

    data = Object.assign({}, data, enroll);
    const foundCourses = await courseService.getCourse([courseCode]);
    
    if (foundCourses && foundCourses.length > 0) {
        const course = foundCourses[0];
        data['enrolled'].push(course);
    
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
            message: `Can't find any courses. Please try again.`
        });
    }
};

const list = async (req, res, next) => {
    
};

const getEnroll = async (req, res, next) => {
    const { username } = req.body;
    if (!username || username.length < 1) {
        return res.json({
            success: false,
            message: `Your data was not fully. Please try again`
        });
    }

    const enroll = await registrationService.getEnrollByUsername([username]);
    if (enroll) {
        res.json({
            success: true,
            message: `Found`,
            data: [
                enroll,
            ]
        });
    } else {
        return res.status(404).json({
            success: false,
            message: `Not found`
        });
    }
};

module.exports = {
    rollup,
    list,
    getEnroll,
}