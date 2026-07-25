import express from "express";

import {

    createMarks,

    getAllMarks,

    getMarksById,

    getMarksByStudent,

    getMarksByExam,

    getMarksByCourseOffering,

    getStudentResultSummary,

    updateMarks,

    deleteMarks

} from "../controllers/marks.controller.js";

import { authMiddleware } from "../middleware/authmiddleware.js";

import { authorizeRoles } from "../middleware/role.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import {

    createMarksValidation,

    updateMarksValidation

} from "../middleware/marks.validation.js";

const router = express.Router();

/**
 * Create Marks
 * Admin, Faculty
 */
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    createMarksValidation,
    validate,
    createMarks
);

/**
 * Get All Marks
 * Admin, Faculty
 */
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getAllMarks
);

/**
 * Get Marks By ID
 * Admin, Faculty
 */
router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getMarksById
);

/**
 * Get Marks By Student
 * Admin, Faculty, Student
 */
router.get(
    "/student/:studentId",
    authMiddleware,
    authorizeRoles("admin", "faculty", "student"),
    getMarksByStudent
);

/**
 * Student Result Summary
 * Admin, Faculty, Student
 */
router.get(
    "/student/:studentId/summary",
    authMiddleware,
    authorizeRoles("admin", "faculty", "student"),
    getStudentResultSummary
);

/**
 * Get Marks By Exam
 * Admin, Faculty
 */
router.get(
    "/exam/:examId",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getMarksByExam
);

/**
 * Get Marks By Course Offering
 * Admin, Faculty
 */
router.get(
    "/course-offering/:courseOfferingId",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getMarksByCourseOffering
);

/**
 * Update Marks
 * Admin, Faculty
 */
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    updateMarksValidation,
    validate,
    updateMarks
);

/**
 * Delete Marks
 * Admin Only
 */
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteMarks
);

export default router;