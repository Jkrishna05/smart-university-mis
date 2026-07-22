import {
    registerService,
    loginService,
    logoutService,
    getProfileService
} from "../services/auth.service.js";

export const registerUser = async (req, res) => {

    try {

        const result = await registerService(req.body);

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: result.user
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

export const loginUser = async (req, res) => {

    try {

        const result = await loginService(req.body);

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: result.user
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

export const logoutUser = async (req, res) => {

    try {

        const token = req.cookies.token;

        await logoutService(req.user.id, token);

        res.clearCookie("token");

        res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getUserProfile = async (req, res) => {

    try {

        const user = await getProfileService(
            req.user.id
        );

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }

};