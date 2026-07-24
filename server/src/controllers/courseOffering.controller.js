import {

    createCourseOfferingService,

    getAllCourseOfferingsService,

    getCourseOfferingByIdService,

    getCourseOfferingsByFacultyService,

    getCourseOfferingsBySemesterService,

    updateCourseOfferingService,

    deleteCourseOfferingService

} from "../services/courseOffering.service.js";

/**
 * Create Course Offering
 */
export const createCourseOffering = async (req, res) => {

    try {

        const result = await createCourseOfferingService(req.body);

        return res.status(201).json({

            success: true,

            message: "Course offering created successfully.",

            courseOfferingId: result.insertId

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get All Course Offerings
 */
export const getAllCourseOfferings = async (req, res) => {

    try {

        const offerings = await getAllCourseOfferingsService();

        return res.status(200).json({

            success: true,

            total: offerings.length,

            data: offerings

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Course Offering By ID
 */
export const getCourseOfferingById = async (req, res) => {

    try {

        const offering = await getCourseOfferingByIdService(req.params.id);

        return res.status(200).json({

            success: true,

            data: offering

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Course Offerings By Faculty
 */
export const getCourseOfferingsByFaculty = async (req, res) => {

    try {

        const offerings = await getCourseOfferingsByFacultyService(

            req.params.facultyId

        );

        return res.status(200).json({

            success: true,

            total: offerings.length,

            data: offerings

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Course Offerings By Semester
 */
export const getCourseOfferingsBySemester = async (req, res) => {

    try {

        const offerings = await getCourseOfferingsBySemesterService(

            req.params.semester

        );

        return res.status(200).json({

            success: true,

            total: offerings.length,

            data: offerings

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Update Course Offering
 */
export const updateCourseOffering = async (req, res) => {

    try {

        await updateCourseOfferingService(

            req.params.id,

            req.body

        );

        return res.status(200).json({

            success: true,

            message: "Course offering updated successfully."

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Delete Course Offering
 */
export const deleteCourseOffering = async (req, res) => {

    try {

        await deleteCourseOfferingService(req.params.id);

        return res.status(200).json({

            success: true,

            message: "Course offering deleted successfully."

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};