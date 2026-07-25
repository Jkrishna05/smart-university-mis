import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/auth.routes.js';
import studentRoutes from "./routes/student.routes.js";
import facultyRouter from "./routes/faculty.routes.js";
import departmentRouter from './routes/department.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import courseRoutes from './routes/course.routes.js';
import courseOfferingRoutes from './routes/courseOffering.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import examRoutes from './routes/exam.routes.js';
import feesRoutes from './routes/fees.routes.js';
import marksRoutes from './routes/marks.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
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
app.use("/notifications", notificationRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/courses", courseRoutes);
app.use("/course-offerings", courseOfferingRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/exams", examRoutes);
app.use("/fees", feesRoutes);
app.use("/marks", marksRoutes);
app.use("/dashboard", dashboardRoutes);

export default app;