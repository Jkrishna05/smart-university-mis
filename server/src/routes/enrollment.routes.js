import express from "express";

import {

    createEnrollment,

    getAllEnrollments,

    getEnrollmentById,

    getStudentEnrollments,

    getStudentsByCourseOffering,

    updateEnrollment,

    deleteEnrollment

} from "../controllers/enrollment.controller.js";

import { authMiddleware } from "../middleware/authmiddleware.js";

import { authorizeRoles } from "../middleware/role.middleware.js";

import { validate } from "../middleware/validation.middleware.js";

import {

    createEnrollmentValidation,

    updateEnrollmentValidation

} from "../validations/enrollment.validation.js";

const router = express.Router();

/**
 * Create Enrollment
 * Admin Only
 */
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    createEnrollmentValidation,
    validate,
    createEnrollment
);

/**
 * Get All Enrollments
 * Admin Only
 */
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    getAllEnrollments
);

/**
 * Get Enrollment By ID
 * Admin Only
 */
router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    getEnrollmentById
);

/**
 * Get All Courses of a Student
 * Admin & Student
 */
router.get(
    "/student/:studentId",
    authMiddleware,
    authorizeRoles("admin", "student"),
    getStudentEnrollments
);

/**
 * Get Students of a Course
 * Admin & Faculty
 */
router.get(
    "/course/:courseOfferingId",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getStudentsByCourseOffering
);

/**
 * Update Enrollment Status
 * Admin Only
 */
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateEnrollmentValidation,
    validate,
    updateEnrollment
);

/**
 * Delete Enrollment
 * Admin Only
 */
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteEnrollment
);

export default router;