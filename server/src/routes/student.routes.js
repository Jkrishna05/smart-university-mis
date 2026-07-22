import express from "express";

import {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} from "../controllers/student.controller.js";

import { authMiddleware } from "../middleware/authmiddleware.js";

import { authorizeRoles } from "../middleware/role.middleware.js";

import {
    createStudentValidation,
    updateStudentValidation
} from "../middleware/student.validation.js";

import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

/**
 * Create Student
 * Only Admin
 */
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    createStudentValidation,
    validate,
    createStudent
);

/**
 * Get All Students
 * Admin & Faculty
 */
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getAllStudents
);

/**
 * Get Student By ID
 * Admin, Faculty, Student
 */
router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "faculty", "student"),
    getStudentById
);

/**
 * Update Student
 * Only Admin
 */
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateStudentValidation,
    validate,
    updateStudent
);

/**
 * Delete Student
 * Only Admin
 */
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteStudent
);

export default router;