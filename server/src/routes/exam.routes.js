import express from "express";

import {

    createExam,

    getAllExams,

    getExamById,

    getExamsByCourseOffering,

    updateExam,

    deleteExam

} from "../controllers/exam.controller.js";

import { authMiddleware } from "../middleware/authmiddleware.js";

import { authorizeRoles } from "../middleware/role.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import {

    createExamValidation,

    updateExamValidation

} from "../middleware/exam.validation.js";

const router = express.Router();

/**
 * Create Exam
 * Admin, Faculty
 */
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    createExamValidation,
    validate,
    createExam
);

/**
 * Get All Exams
 * Admin, Faculty
 */
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getAllExams
);

/**
 * Get Exam By ID
 * Admin, Faculty
 */
router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getExamById
);

/**
 * Get Exams By Course Offering
 * Admin, Faculty
 */
router.get(
    "/course-offering/:courseOfferingId",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getExamsByCourseOffering
);

/**
 * Update Exam
 * Admin, Faculty
 */
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    updateExamValidation,
    validate,
    updateExam
);

/**
 * Delete Exam
 * Admin Only
 */
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteExam
);

export default router;