import { pool } from "../config/db.js";

export const findUserByNameOrEmail = async (name, email) => {
    const [rows] = await pool.query(
        `SELECT * FROM users
         WHERE name = ? OR email = ?`,
        [name, email]
    );

    return rows;
};

export const createUser = async (name, email, password, role) => {

    const [result] = await pool.query(
        `INSERT INTO users
        (name,email,password,role)
        VALUES(?,?,?,?)`,
        [name, email, password, role]
    );

    return result;
};

export const findUserByEmail = async (email) => {

    const [rows] = await pool.query(
        `SELECT * FROM users
        WHERE email=?`,
        [email]
    );

    return rows;
};

export const findUserById = async (id) => {

    const [rows] = await pool.query(
        `SELECT id,name,email,role,status,created_at
        FROM users
        WHERE id=?`,
        [id]
    );

    return rows;
};

export const blacklistToken = async (userId, token) => {

    await pool.query(
        `INSERT INTO blacklist_tokens(user_id,token)
        VALUES(?,?)`,
        [userId, token]
    );

};

export const isTokenBlacklisted = async (token) => {

    const [rows] = await pool.query(
        `SELECT * FROM blacklist_tokens
        WHERE token=?`,
        [token]
    );

    return rows;
};