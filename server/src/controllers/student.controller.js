import {
    createStudentService,
    getStudentsService,
    getStudentByIdService,
    updateStudentService,
    deleteStudentService
} from "../services/student.service.js";

/**
 * Create Student
 */
export const createStudent = async (req, res) => {

    try {

        const student = await createStudentService(req.body);

        return res.status(201).json({
            success: true,
            message: "Student created successfully.",
            student
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * Get All Students
 */
export const getAllStudents = async (req, res) => {

    try {

        const students = await getStudentsService();

        return res.status(200).json({
            success: true,
            total: students.length,
            students
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * Get Student By ID
 */
export const getStudentById = async (req, res) => {

    try {

        const student = await getStudentByIdService(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            student
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * Update Student
 */
export const updateStudent = async (req, res) => {

    try {

        const result = await updateStudentService(
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
 * Delete Student
 */
export const deleteStudent = async (req, res) => {

    try {

        await deleteStudentService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully."
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }

};