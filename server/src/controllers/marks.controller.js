import {

    createMarksService,

    getAllMarksService,

    getMarksByIdService,

    getMarksByStudentService,

    getMarksByExamService,

    getMarksByCourseOfferingService,

    updateMarksService,

    deleteMarksService,

    getStudentResultSummaryService

} from "../services/marks.service.js";

/**
 * Create Marks
 */
export const createMarks = async (req, res) => {

    try {

        const result = await createMarksService(req.body);

        return res.status(201).json({

            success: true,

            message: "Marks added successfully.",

            marksId: result.insertId

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get All Marks
 */
export const getAllMarks = async (req, res) => {

    try {

        const marks = await getAllMarksService();

        return res.status(200).json({

            success: true,

            total: marks.length,

            data: marks

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Marks By ID
 */
export const getMarksById = async (req, res) => {

    try {

        const marks = await getMarksByIdService(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            data: marks

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Marks By Student
 */
export const getMarksByStudent = async (req, res) => {

    try {

        const marks = await getMarksByStudentService(
            req.params.studentId
        );

        return res.status(200).json({

            success: true,

            total: marks.length,

            data: marks

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Marks By Exam
 */
export const getMarksByExam = async (req, res) => {

    try {

        const marks = await getMarksByExamService(
            req.params.examId
        );

        return res.status(200).json({

            success: true,

            total: marks.length,

            data: marks

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Marks By Course Offering
 */
export const getMarksByCourseOffering = async (req, res) => {

    try {

        const marks = await getMarksByCourseOfferingService(
            req.params.courseOfferingId
        );

        return res.status(200).json({

            success: true,

            total: marks.length,

            data: marks

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Update Marks
 */
export const updateMarks = async (req, res) => {

    try {

        await updateMarksService(

            req.params.id,

            req.body

        );

        return res.status(200).json({

            success: true,

            message: "Marks updated successfully."

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Delete Marks
 */
export const deleteMarks = async (req, res) => {

    try {

        await deleteMarksService(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            message: "Marks deleted successfully."

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Student Result Summary
 */
export const getStudentResultSummary = async (req, res) => {

    try {

        const summary =
            await getStudentResultSummaryService(
                req.params.studentId
            );

        return res.status(200).json({

            success: true,

            data: summary

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};