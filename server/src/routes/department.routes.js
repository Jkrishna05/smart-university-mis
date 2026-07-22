import express from "express";

import {
    createDepartment,
    getDepartments,
    getDepartment,
    updateDepartment,
    deleteDepartment
} from "../controllers/department.controller.js";

import { authMiddleware } from "../middleware/authmiddleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { departmentValidation } from "../middleware/department.validation.js";
import { validate } from "../middleware/validate.middleware.js";

const departmentRouter = express.Router();

/**
 * Create Department
 * Admin Only
 */
departmentRouter.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    departmentValidation,
    validate,
    createDepartment
);

/**
 * Get All Departments
 * Logged In Users
 */
departmentRouter.get(
    "/",
    authMiddleware,
    getDepartments
);

/**
 * Get Department By Id
 * Logged In Users
 */
departmentRouter.get(
    "/:id",
    authMiddleware,
    getDepartment
);

/**
 * Update Department
 * Admin Only
 */
departmentRouter.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    departmentValidation,
    validate,
    updateDepartment
);

/**
 * Delete Department (Soft Delete)
 * Admin Only
 */
departmentRouter.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteDepartment
);

export default departmentRouter;