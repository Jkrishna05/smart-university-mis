import express from "express";

import {
    createFaculty,
    getAllFaculty,
    getFacultyById,
    updateFaculty,
    deleteFaculty
} from "../controllers/faculty.controller.js";

import { authMiddleware } from "../middleware/authmiddleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

import { facultyValidation } from "../middleware/faculty.validation.js";
import { validate } from "../middleware/validate.middleware.js";

const facultyRouter = express.Router();

/**
 * Create Faculty
 * Only Admin
 */
facultyRouter.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    facultyValidation,
    validate,
    createFaculty
);

/**
 * Get All Faculty
 * Admin & Faculty
 */
facultyRouter.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getAllFaculty
);

/**
 * Get Faculty By ID
 * Admin & Faculty
 */
facultyRouter.get(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "faculty"),
    getFacultyById
);

/**
 * Update Faculty
 * Only Admin
 */
facultyRouter.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    facultyValidation,
    validate,
    updateFaculty
);

/**
 * Delete Faculty
 * Only Admin
 */
facultyRouter.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteFaculty
);

export default facultyRouter;