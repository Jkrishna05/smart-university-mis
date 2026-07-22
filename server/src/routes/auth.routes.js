import express from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile } from '../controllers/authcontroller.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import { registerValidation, loginValidation } from '../middleware/auth.validation.js';
const userRouter = express.Router();

userRouter.post("/register", registerValidation, registerUser);
userRouter.post("/login", loginValidation, loginUser);
userRouter.get("/logout", authMiddleware, logoutUser);
userRouter.get("/getuser", authMiddleware, getUserProfile);

export default userRouter;



