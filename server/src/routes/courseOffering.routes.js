import express from "express";

import {

    createCourseOffering,

    getAllCourseOfferings,

    getCourseOfferingById,

    getCourseOfferingsByFaculty,

    getCourseOfferingsBySemester,

    updateCourseOffering,

    deleteCourseOffering

} from "../controllers/courseOffering.controller.js";

import { authMiddleware } from "../middleware/authmiddleware.js";

import { authorizeRoles } from "../middleware/role.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import {

    createCourseOfferingValidation,

    updateCourseOfferingValidation

} from "../middleware/courseOffering.validation.js";

const router = express.Router();

/**
 * Create Course Offering
 * Admin Only
 */
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    createCourseOfferingValidation,
    validate,
    createCourseOffering
);

/**
 * Get All Course Offerings
 * Admin, Faculty
 */
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getAllCourseOfferings
);

/**
 * Get Course Offering By ID
 * Admin, Faculty
 */
router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getCourseOfferingById
);

/**
 * Get Course Offerings By Faculty
 * Admin, Faculty
 */
router.get(
    "/faculty/:facultyId",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getCourseOfferingsByFaculty
);

/**
 * Get Course Offerings By Semester
 * Admin, Faculty
 */
router.get(
    "/semester/:semester",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getCourseOfferingsBySemester
);

/**
 * Update Course Offering
 * Admin Only
 */
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateCourseOfferingValidation,
    validate,
    updateCourseOffering
);

/**
 * Delete Course Offering
 * Admin Only
 */
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteCourseOffering
);

export default router;