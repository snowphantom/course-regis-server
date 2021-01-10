const courseService = require('../services/course-service');
const registrationService = require('../services/registration-service');
const { v4 : uuidv4 } = require('uuid');
const { checkConflictTime } = require('../helpers/datetime-helper');
const ValidateException = require('../exceptions/validate-exception');

const rollup = async (req, res, next) => {
    let data = req.body;

    if (!data || !data.code || !data.username) {
        return res.json({
            success: false,
            message: `Your data was not fully. Please try again.`
        });
    }
    const courseCode = data.code.length > 0 && data.code.toUpperCase();

    const enroll = await registrationService.getEnrollByUsername([data.username]) || {};
    enroll['enrolled'] = enroll && enroll.enrolled || [];
    if (enroll.enrolled && enroll.enrolled.filter(e => e === courseCode).length > 0) {
        return res.json({
            success: false,
            message: `Course ${courseCode} was enrolled.`
        });
    }

    data['_id'] = enroll && enroll._id || uuidv4();
    data = Object.assign({}, data, enroll);
    const foundCourses = await courseService.getCourse([courseCode]);
    const errolledCourses = await courseService.getCourse([...enroll.enrolled]);
    
    if (foundCourses && foundCourses.length > 0) {
        const course = foundCourses[0];

        const dupDateCourses = errolledCourses && errolledCourses.filter(e => e.day === course.day);
        for (let item of dupDateCourses) {
            if (checkConflictTime(course, item)) {
                return res.json({
                    success: false,
                    message: `Course ${course.code} is conflict with ${item.code} have enrolled.`,
                });
            }
        };

        data['enrolled'].push(course.code);
    
        registrationService.updateRegistration(data)
            .then(data => {
                res.json({
                    success: true,
                    message: `User ${data.username} enroll ${courseCode} successfully`,
                    data
                });
            })
            .catch(err => next(err));
    } else {
        return res.status(404).json({
            success: false,
            message: `Can't find any courses. Please try again.`
        });
    }
};

const rolloff = async (req, res, next) => {
    let data = req.body;

    if (!data || !data.code || !data.username) {
        return res.json({
            success: false,
            message: `Your data was not fully. Please try again.`
        });
    }
    const courseCode = data.code.length > 0 && data.code.toUpperCase();

    const enroll = await registrationService.getEnrollByUsername([data.username]) || {};
    const indexOfCourse = enroll && enroll.enrolled ? enroll.enrolled.findIndex(e => `${e}` === `${courseCode}`) : -1;
    if (indexOfCourse < 0) {
        return res.json({
            success: false,
            message: `User ${data.username} was not roll up ${courseCode}.`
        });
    }

    enroll.enrolled.splice(indexOfCourse, 1);

    data['_id'] = enroll && enroll._id || uuidv4();
    data = Object.assign({}, data, enroll);

    registrationService.updateRegistration(data)
            .then(data => {
                res.json({
                    success: true,
                    message: `User ${data.username} roll off ${courseCode} successfully`,
                    data
                });
            })
            .catch(err => next(err));
};

const list = async (req, res, next) => {
    registrationService.listRegistration(req.body)
        .then(data => {
            res.json({
                success: true,
                message: `Found`,
                data: [...data],
                paging: req.body.paging || 0,
            })
        });
};

const getEnroll = async (req, res, next) => {
    const { username } = Object.assign({}, req.body, req.query);
    if (!username || username.length < 1) {
        return res.json({
            success: false,
            message: `Your data was not fully. Please try again`
        });
    }

    const enroll = await registrationService.getEnrollByUsername([username]);
    res.json({
        success: true,
        message: `Found`,
        data: enroll
    });
};

module.exports = {
    rollup,
    list,
    getEnroll,
    rolloff,
}