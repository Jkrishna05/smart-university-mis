import {

    createEnrollmentService,

    getAllEnrollmentsService,

    getEnrollmentByIdService,

    getStudentEnrollmentsService,

    getStudentsByCourseOfferingService,

    updateEnrollmentService,

    deleteEnrollmentService

} from "../services/enrollment.service.js";

/**
 * Create Enrollment
 */
export const createEnrollment = async (req, res) => {

    try {

        const result = await createEnrollmentService(req.body);

        return res.status(201).json({

            success: true,

            message: "Enrollment created successfully.",

            enrollmentId: result.insertId

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get All Enrollments
 */
export const getAllEnrollments = async (req, res) => {

    try {

        const enrollments = await getAllEnrollmentsService();

        return res.status(200).json({

            success: true,

            total: enrollments.length,

            data: enrollments

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Enrollment By ID
 */
export const getEnrollmentById = async (req, res) => {

    try {

        const enrollment = await getEnrollmentByIdService(req.params.id);

        return res.status(200).json({

            success: true,

            data: enrollment

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Student Enrollments
 */
export const getStudentEnrollments = async (req, res) => {

    try {

        const enrollments = await getStudentEnrollmentsService(
            req.params.studentId
        );

        return res.status(200).json({

            success: true,

            total: enrollments.length,

            data: enrollments

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Students By Course Offering
 */
export const getStudentsByCourseOffering = async (req, res) => {

    try {

        const students = await getStudentsByCourseOfferingService(
            req.params.courseOfferingId
        );

        return res.status(200).json({

            success: true,

            total: students.length,

            data: students

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Update Enrollment
 */
export const updateEnrollment = async (req, res) => {

    try {

        await updateEnrollmentService(

            req.params.id,

            req.body.status

        );

        return res.status(200).json({

            success: true,

            message: "Enrollment updated successfully."

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Delete Enrollment
 */
export const deleteEnrollment = async (req, res) => {

    try {

        await deleteEnrollmentService(req.params.id);

        return res.status(200).json({

            success: true,

            message: "Enrollment deleted successfully."

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};