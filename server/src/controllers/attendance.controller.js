import {

    createAttendanceService,

    getAllAttendanceService,

    getAttendanceByIdService,

    getAttendanceByStudentService,

    getAttendanceByCourseOfferingService,

    getAttendanceByDateService,

    updateAttendanceService,

    deleteAttendanceService,

    getAttendanceSummaryService

} from "../services/attendance.service.js";

/**
 * Create Attendance
 */
export const createAttendance = async (req, res) => {

    try {

        const result = await createAttendanceService(req.body);

        return res.status(201).json({

            success: true,

            message: "Attendance marked successfully.",

            attendanceId: result.insertId

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get All Attendance
 */
export const getAllAttendance = async (req, res) => {

    try {

        const attendance = await getAllAttendanceService();

        return res.status(200).json({

            success: true,

            total: attendance.length,

            data: attendance

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Attendance By ID
 */
export const getAttendanceById = async (req, res) => {

    try {

        const attendance = await getAttendanceByIdService(req.params.id);

        return res.status(200).json({

            success: true,

            data: attendance

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Attendance By Student
 */
export const getAttendanceByStudent = async (req, res) => {

    try {

        const attendance = await getAttendanceByStudentService(
            req.params.studentId
        );

        return res.status(200).json({

            success: true,

            total: attendance.length,

            data: attendance

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Attendance By Course Offering
 */
export const getAttendanceByCourseOffering = async (req, res) => {

    try {

        const attendance = await getAttendanceByCourseOfferingService(
            req.params.courseOfferingId
        );

        return res.status(200).json({

            success: true,

            total: attendance.length,

            data: attendance

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Attendance By Date
 */
export const getAttendanceByDate = async (req, res) => {

    try {

        const attendance = await getAttendanceByDateService(

            req.params.courseOfferingId,

            req.params.date

        );

        return res.status(200).json({

            success: true,

            total: attendance.length,

            data: attendance

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Update Attendance
 */
export const updateAttendance = async (req, res) => {

    try {

        await updateAttendanceService(

            req.params.id,

            req.body

        );

        return res.status(200).json({

            success: true,

            message: "Attendance updated successfully."

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Delete Attendance
 */
export const deleteAttendance = async (req, res) => {

    try {

        await deleteAttendanceService(req.params.id);

        return res.status(200).json({

            success: true,

            message: "Attendance deleted successfully."

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Attendance Summary
 */
export const getAttendanceSummary = async (req, res) => {

    try {

        const summary = await getAttendanceSummaryService(
            req.params.enrollmentId
        );

        return res.status(200).json({

            success: true,

            data: summary

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};