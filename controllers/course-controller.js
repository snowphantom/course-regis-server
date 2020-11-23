const courseService = require('../services/course-service');
const { v4 : uuidv4 } = require('uuid');
const md5 = require('md5');
const Exception = require('../exceptions/exception');
const e = require('express');

const listCourse = async (req, res, next) => {
    courseService.listCourses(req.body)
        .then(data => {
            res.json({
                success: true,
                message: `Found`,
                data: [...data],
                paging: req.body.paging || 0,
            });
        })
        .catch(err => next(err));
};

const createCourse = async (req, res, next) => {
    let course = req.body;

    if (!course || !course.code) {
        return res.json({
            success: false,
            message: `Your data was not fully. Please try again.`
        });
    }
    
    let items = await courseService.getCourse([course.code]);
    if (items && items.length > 0) {
        return res.json({
            success: false,
            message: `This course was registered on system. Please try again.`
        });
    }

    course['_id'] = course && uuidv4() || null;
    course['state'] = 1;
    course['code'] = course['code'].toUpperCase();
    courseService.updateCourse(course)
        .then(data => {
            res.json({
                success: true,
                message: `Create course successfully`,
                data: [
                    data,
                ]
            });
        })
        .catch(err => next(err));
};

const updateCourse = async (req, res, next) => {
    let course = req.body;

    if (!course || !course._id || !course.code) {
        return res.json({
            success: false,
            message: `Your data was not fully. Please try again.`
        });
    }

    courseService.updateCourse(course)
        .then(data => {
            res.json({
                success: true,
                message: `Update course successfully`,
                data: [
                    data,
                ]
            });
        })
        .catch(err => next(err));
};

const removeCourse = async (req, res, next) => {
    const {code} = req.body;
    await courseService.removeCourse(code && code.toUpperCase())
        .then(result => {
            res.json({
                success: true,
                message: `Remove ${code} successfully.`
            });
        })
        .catch(err => {
            res.json({
                success: false,
                message: err.message
            });
        });
};

const getCourse = async (req, res, next) => {
    const {code} = req.body;
    const codeList = code && code.toUpperCase().split(',');
    if (!codeList || codeList.length < 1) {
        return res.json({
            success: false,
            message: `Your data was not fully. Please try again`
        });
    }

    const course = await courseService.getCourse(codeList);
    if (course) {
        res.json({
            success: true,
            message: `Found`,
            data: [
                ...course,
            ]
        });
    } else {
        return res.status(404).json({
            success: false,
            message: `Not found`
        }); 
    }
;}

module.exports = {
    listCourse,
    createCourse,
    updateCourse,
    removeCourse,
    getCourse,
}