import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
 
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));



app.use("/auth", userRouter);



export default app;