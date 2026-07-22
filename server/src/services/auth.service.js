import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    createUser,
    findUserByEmail,
    findUserById,
    findUserByNameOrEmail,
    blacklistToken
} from "../repositories/auth.repository.js";

export const registerService = async (data) => {

    const { name, email, password, role = "student" } = data;

    if (!name || !email || !password) {
        throw new Error("All fields are required");
    }

    const userExist = await findUserByNameOrEmail(name, email);

    if (userExist.length > 0) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await createUser(
        name,
        email,
        hashedPassword,
        role
    );

    const token = jwt.sign(
        {
            id: result.insertId,
            role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        token,
        user: {
            id: result.insertId,
            name,
            email,
            role
        }
    };
};

export const loginService = async ({ email, password }) => {

    const users = await findUserByEmail(email);

    if (users.length === 0) {
        throw new Error("Invalid credentials");
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };

};

export const logoutService = async (userId, token) => {

    await blacklistToken(userId, token);

};

export const getProfileService = async (id) => {

    const users = await findUserById(id);

    if (users.length === 0) {
        throw new Error("User not found");
    }

    return users[0];

};