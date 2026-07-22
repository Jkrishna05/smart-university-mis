import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/auth.routes.js';
import studentRoutes from "./routes/student.routes.js";
import facultyRouter from "./routes/faculty.routes.js";
import departmentRouter from './routes/department.routes.js';
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));



app.use("/auth", userRouter);
app.use("/faculty", facultyRouter);
app.use("/departments", departmentRouter);
app.use("/students", studentRoutes);



export default app;