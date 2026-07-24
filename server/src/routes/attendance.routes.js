import express from "express";

import {

    createAttendance,

    getAllAttendance,

    getAttendanceById,

    getAttendanceByStudent,

    getAttendanceByCourseOffering,

    getAttendanceByDate,

    updateAttendance,

    deleteAttendance,

    getAttendanceSummary

} from "../controllers/attendance.controller.js";

import { authMiddleware } from "../middleware/authmiddleware.js";

import { authorizeRoles } from "../middleware/role.middleware.js";

import { validate } from "../middleware/validation.middleware.js";

import {

    createAttendanceValidation,

    updateAttendanceValidation

} from "../validations/attendance.validation.js";

const router = express.Router();

/**
 * Create Attendance
 * Admin, Faculty
 */
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    createAttendanceValidation,
    validate,
    createAttendance
);

/**
 * Get All Attendance
 * Admin, Faculty
 */
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getAllAttendance
);

/**
 * Get Attendance By ID
 * Admin, Faculty
 */
router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getAttendanceById
);

/**
 * Get Attendance By Student
 * Admin, Faculty, Student
 */
router.get(
    "/student/:studentId",
    authMiddleware,
    authorizeRoles("admin", "faculty", "student"),
    getAttendanceByStudent
);

/**
 * Get Attendance By Course Offering
 * Admin, Faculty
 */
router.get(
    "/course-offering/:courseOfferingId",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getAttendanceByCourseOffering
);

/**
 * Get Attendance By Date
 * Admin, Faculty
 */
router.get(
    "/course-offering/:courseOfferingId/date/:date",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getAttendanceByDate
);

/**
 * Get Attendance Summary
 * Admin, Faculty, Student
 */
router.get(
    "/summary/:enrollmentId",
    authMiddleware,
    authorizeRoles("admin", "faculty", "student"),
    getAttendanceSummary
);

/**
 * Update Attendance
 * Admin, Faculty
 */
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    updateAttendanceValidation,
    validate,
    updateAttendance
);

/**
 * Delete Attendance
 * Admin Only
 */
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteAttendance
);

export default router;