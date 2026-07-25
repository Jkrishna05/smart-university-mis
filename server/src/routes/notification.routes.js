import express from "express";

import {

    createNotification,

    getAllNotifications,

    getNotificationById,

    getNotificationsByUser,

    getUnreadNotifications,

    markAsRead,

    deleteNotification,

    deleteOldNotifications

} from "../controllers/notification.controller.js";

import { authMiddleware } from "../middleware/authmiddleware.js";

import { authorizeRoles } from "../middleware/role.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import {

    createNotificationValidation

} from "../middleware/notification.validation.js";

const router = express.Router();

/**
 * Create Notification
 * Admin Only
 */
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    createNotificationValidation,
    validate,
    createNotification
);

/**
 * Get All Notifications
 * Admin Only
 */
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    getAllNotifications
);

/**
 * Get Notification By ID
 */
router.get(
    "/:id",
    authMiddleware,
    getNotificationById
);

/**
 * Get Notifications Of Logged User
 */
router.get(
    "/my",
    authMiddleware,
    getNotificationsByUser
);

/**
 * Get Unread Notifications
 */
router.get(
    "/my/unread",
    authMiddleware,
    getUnreadNotifications
);
/**
 * Mark Notification As Read
 */
router.patch(
    "/:id/read",
    authMiddleware,
    markAsRead
);

/**
 * Delete Notification
 * Admin Only
 */
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteNotification
);

/**
 * Delete Notifications Older Than 90 Days
 * Admin Only
 */
router.delete(
    "/cleanup/old",
    authMiddleware,
    authorizeRoles("admin"),
    deleteOldNotifications
);

export default router;