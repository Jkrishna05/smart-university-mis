import jwt from "jsonwebtoken";
import {
    isTokenBlacklisted
} from "../repositories/auth.repository.js";

export const authMiddleware = async (req, res, next) => {

    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            });
        }

        // Check if token is blacklisted
        const blacklisted = await isTokenBlacklisted(token);

        if (blacklisted.length > 0) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token has been revoked"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        console.error(error);

        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or Expired Token"
        });

    }

};