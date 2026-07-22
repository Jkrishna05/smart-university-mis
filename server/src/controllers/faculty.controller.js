import {
    createFacultyService,
    getFacultyService,
    getFacultyByIdService,
    updateFacultyService,
    deleteFacultyService
} from "../services/faculty.service.js";

/**
 * Create Faculty
 */
export const createFaculty = async (req, res) => {

    try {

        const faculty = await createFacultyService(req.body);

        return res.status(201).json({
            success: true,
            message: "Faculty created successfully.",
            faculty
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * Get All Faculty
 */
export const getAllFaculty = async (req, res) => {

    try {

        const faculty = await getFacultyService();

        return res.status(200).json({
            success: true,
            total: faculty.length,
            faculty
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * Get Faculty By ID
 */
export const getFacultyById = async (req, res) => {

    try {

        const faculty = await getFacultyByIdService(req.params.id);

        return res.status(200).json({
            success: true,
            faculty
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * Update Faculty
 */
export const updateFaculty = async (req, res) => {

    try {

        const result = await updateFacultyService(
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
 * Delete Faculty
 */
export const deleteFaculty = async (req, res) => {

    try {

        await deleteFacultyService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Faculty deleted successfully."
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }

};