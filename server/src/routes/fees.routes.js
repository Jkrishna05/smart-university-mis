import express from "express";

import {

    createFee,

    getAllFees,

    getFeeById,

    getFeesByStudentId,

    updateFee,

    updatePayment,

    deleteFee

} from "../controllers/fees.controller.js";

import { authMiddleware } from "../middleware/authmiddleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * Create Fee
 * Admin Only
 */
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    createFee
);

/**
 * Get All Fees
 * Admin
 */
router.get(
    "/",
    authMiddleware,
    getAllFees
);

/**
 * Get Fee By Id
 */
router.get(
    "/:id",
    authMiddleware,
    getFeeById
);

/**
 * Get Fees By Student Id
 */
router.get(
    "/student/:student_id",
    authMiddleware,
    getFeesByStudentId
);

/**
 * Update Fee
 */
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateFee
);

/**
 * Update Payment
 */
router.patch(
    "/:id/payment",
    authMiddleware,
    authorizeRoles("admin"),
    updatePayment
);

/**
 * Delete Fee
 */
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteFee
);

export default router;