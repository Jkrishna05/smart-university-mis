import {

    createExamService,

    getAllExamsService,

    getExamByIdService,

    getExamsByCourseOfferingService,

    updateExamService,

    deleteExamService

} from "../services/exam.service.js";

/**
 * Create Exam
 */
export const createExam = async (req, res) => {

    try {

        const result = await createExamService(req.body);

        return res.status(201).json({

            success: true,

            message: "Exam created successfully.",

            examId: result.insertId

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get All Exams
 */
export const getAllExams = async (req, res) => {

    try {

        const exams = await getAllExamsService();

        return res.status(200).json({

            success: true,

            total: exams.length,

            data: exams

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Exam By ID
 */
export const getExamById = async (req, res) => {

    try {

        const exam = await getExamByIdService(req.params.id);

        return res.status(200).json({

            success: true,

            data: exam

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Exams By Course Offering
 */
export const getExamsByCourseOffering = async (req, res) => {

    try {

        const exams = await getExamsByCourseOfferingService(
            req.params.courseOfferingId
        );

        return res.status(200).json({

            success: true,

            total: exams.length,

            data: exams

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Update Exam
 */
export const updateExam = async (req, res) => {

    try {

        await updateExamService(

            req.params.id,

            req.body

        );

        return res.status(200).json({

            success: true,

            message: "Exam updated successfully."

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Delete Exam
 */
export const deleteExam = async (req, res) => {

    try {

        await deleteExamService(req.params.id);

        return res.status(200).json({

            success: true,

            message: "Exam deleted successfully."

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};