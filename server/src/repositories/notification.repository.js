import db from "../config/db.js";

/**
 * Create Notification
 */
export const createNotification = async (
    title,
    message,
    notification_type,
    target_role,
    target_user_id,
    source_module
) => {

    const [result] = await db.execute(
        `
        INSERT INTO notifications
        (
            title,
            message,
            notification_type,
            target_role,
            target_user_id,
            source_module
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            title,
            message,
            notification_type,
            target_role,
            target_user_id,
            source_module
        ]
    );

    return result;

};

/**
 * Get All Notifications
 */
export const getAllNotifications = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            n.*,

            u.name AS target_user_name

        FROM notifications n

        LEFT JOIN users u
            ON n.target_user_id = u.id

        ORDER BY
            n.created_at DESC
        `
    );

    return rows;

};

/**
 * Get Notification By ID
 */
export const getNotificationById = async (id) => {

    const [rows] = await db.execute(
        `
        SELECT *

        FROM notifications

        WHERE id = ?

        LIMIT 1
        `,
        [id]
    );

    return rows;

};

/**
 * Get Notifications By User
 */
export const getNotificationsByUser = async (
    user_id,
    role
) => {

    const [rows] = await db.execute(
        `
        SELECT *

        FROM notifications

        WHERE

            target_user_id = ?

            OR

            target_role = ?

            OR

            target_role = 'all'

        ORDER BY
            created_at DESC
        `,
        [
            user_id,
            role
        ]
    );

    return rows;

};

/**
 * Get Unread Notifications
 */
export const getUnreadNotifications = async (
    user_id,
    role
) => {

    const [rows] = await db.execute(
        `
        SELECT *

        FROM notifications

        WHERE

            is_read = FALSE

        AND

        (

            target_user_id = ?

            OR

            target_role = ?

            OR

            target_role = 'all'

        )

        ORDER BY
            created_at DESC
        `,
        [
            user_id,
            role
        ]
    );

    return rows;

};

/**
 * Mark Notification As Read
 */
export const markAsRead = async (id) => {

    const [result] = await db.execute(
        `
        UPDATE notifications

        SET

            is_read = TRUE

        WHERE id = ?
        `,
        [id]
    );

    return result;

};

/**
 * Delete Notification
 */
export const deleteNotification = async (id) => {

    const [result] = await db.execute(
        `
        DELETE FROM notifications

        WHERE id = ?
        `,
        [id]
    );

    return result;

};

/**
 * Delete Old Notifications
 */
export const deleteOldNotifications = async () => {

    const [result] = await db.execute(
        `
        DELETE FROM notifications

        WHERE created_at <
        DATE_SUB(NOW(), INTERVAL 90 DAY)
        `
    );

    return result;

};