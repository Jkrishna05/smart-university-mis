import express from "express";

import { getDashboard } from "../controllers/dashboard.controller.js";

import { authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();

/**
 * Dashboard
 * Accessible by:
 * Admin
 * Faculty
 * Student
 */
router.get(
    "/",
    authMiddleware,
    getDashboard
);

export default router;