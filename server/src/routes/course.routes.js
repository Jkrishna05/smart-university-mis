import express from "express";

import {

    createCourse,

    getAllCourses,

    getCourseById,

    updateCourse,

    deleteCourse

} from "../controllers/course.controller.js";

import { authMiddleware } from "../middleware/authmiddleware.js";

import { authorizeRoles } from "../middleware/role.middleware.js";

import {

    createCourseValidation,

    updateCourseValidation

} from "../middleware/course.validation.js";

import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

/**
 * Create Course
 * Only Admin
 */
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    createCourseValidation,
    validate,
    createCourse
);

/**
 * Get All Courses
 * Admin, Faculty, Student
 */
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "faculty", "student"),
    getAllCourses
);

/**
 * Get Course By ID
 * Admin, Faculty, Student
 */
router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "faculty", "student"),
    getCourseById
);

/**
 * Update Course
 * Only Admin
 */
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateCourseValidation,
    validate,
    updateCourse
);

/**
 * Delete Course
 * Only Admin
 */
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteCourse
);

export default router;