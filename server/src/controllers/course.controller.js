import {

    createCourseService,

    getCoursesService,

    getCourseByIdService,

    updateCourseService,

    deleteCourseService

} from "../services/course.service.js";

/**
 * Create Course
 */
export const createCourse = async (req, res) => {

    try {

        const course = await createCourseService(req.body);

        return res.status(201).json({

            success: true,

            message: "Course created successfully.",

            course

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get All Courses
 */
export const getAllCourses = async (req, res) => {

    try {

        const courses = await getCoursesService();

        return res.status(200).json({

            success: true,

            total: courses.length,

            courses

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Course By ID
 */
export const getCourseById = async (req, res) => {

    try {

        const course = await getCourseByIdService(

            req.params.id

        );

        return res.status(200).json({

            success: true,

            course

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Update Course
 */
export const updateCourse = async (req, res) => {

    try {

        const result = await updateCourseService(

            req.params.id,

            req.body

        );

        return res.status(200).json({

            success: true,

            message: result.message

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Delete Course
 */
export const deleteCourse = async (req, res) => {

    try {

        await deleteCourseService(

            req.params.id

        );

        return res.status(200).json({

            success: true,

            message: "Course deleted successfully."

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }

};