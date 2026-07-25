import {

    createNotification,

    getAllNotifications,

    getNotificationById,

    getNotificationsByUser,

    getUnreadNotifications,

    markAsRead,

    deleteNotification,

    deleteOldNotifications

} from "../repositories/notification.repository.js";

/**
 * Create Notification
 */
export const createNotificationService = async (data) => {

    const {

        title,

        message,

        notification_type,

        target_role,

        target_user_id,

        source_module

    } = data;

    return await createNotification(

        title,

        message,

        notification_type,

        target_role,

        target_user_id,

        source_module

    );

};

/**
 * Get All Notifications
 */
export const getAllNotificationsService = async () => {

    return await getAllNotifications();

};

/**
 * Get Notification By ID
 */
export const getNotificationByIdService = async (id) => {

    const notification = await getNotificationById(id);

    if (notification.length === 0) {
        throw new Error("Notification not found.");
    }

    return notification[0];

};

/**
 * Get Notifications By User
 */
export const getNotificationsByUserService = async (
    user_id,
    role
) => {

    return await getNotificationsByUser(
        user_id,
        role
    );

};

/**
 * Get Unread Notifications
 */
export const getUnreadNotificationsService = async (
    user_id,
    role
) => {

    return await getUnreadNotifications(
        user_id,
        role
    );

};

/**
 * Mark Notification As Read
 */
export const markAsReadService = async (id) => {

    const notification = await getNotificationById(id);

    if (notification.length === 0) {
        throw new Error("Notification not found.");
    }

    return await markAsRead(id);

};

/**
 * Delete Notification
 */
export const deleteNotificationService = async (id) => {

    const notification = await getNotificationById(id);

    if (notification.length === 0) {
        throw new Error("Notification not found.");
    }

    return await deleteNotification(id);

};

/**
 * Delete Old Notifications
 */
export const deleteOldNotificationsService = async () => {

    return await deleteOldNotifications();

};