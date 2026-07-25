import {

    createNotificationService,

    getAllNotificationsService,

    getNotificationByIdService,

    getNotificationsByUserService,

    getUnreadNotificationsService,

    markAsReadService,

    deleteNotificationService,

    deleteOldNotificationsService

} from "../services/notification.service.js";

/**
 * Create Notification
 */
export const createNotification = async (req, res) => {

    try {

        const result = await createNotificationService(req.body);

        return res.status(201).json({

            success: true,

            message: "Notification created successfully.",

            notificationId: result.insertId

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get All Notifications
 */
export const getAllNotifications = async (req, res) => {

    try {

        const notifications = await getAllNotificationsService();

        return res.status(200).json({

            success: true,

            total: notifications.length,

            data: notifications

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Notification By ID
 */
export const getNotificationById = async (req, res) => {

    try {

        const notification = await getNotificationByIdService(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            data: notification

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Notifications By User
 */
export const getNotificationsByUser = async (req, res) => {

    try {

        const notifications =
            await getNotificationsByUserService(

                req.params.userId,

                req.params.role

            );

        return res.status(200).json({

            success: true,

            total: notifications.length,

            data: notifications

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get Unread Notifications
 */
export const getUnreadNotifications = async (req, res) => {

    try {

        const notifications =
            await getUnreadNotificationsService(

                req.params.userId,

                req.params.role

            );

        return res.status(200).json({

            success: true,

            total: notifications.length,

            data: notifications

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Mark Notification As Read
 */
export const markAsRead = async (req, res) => {

    try {

        await markAsReadService(req.params.id);

        return res.status(200).json({

            success: true,

            message: "Notification marked as read."

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Delete Notification
 */
export const deleteNotification = async (req, res) => {

    try {

        await deleteNotificationService(req.params.id);

        return res.status(200).json({

            success: true,

            message: "Notification deleted successfully."

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Delete Old Notifications
 */
export const deleteOldNotifications = async (req, res) => {

    try {

        await deleteOldNotificationsService();

        return res.status(200).json({

            success: true,

            message: "Old notifications deleted successfully."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};