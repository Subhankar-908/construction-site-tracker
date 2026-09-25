import "dotenv/config";
import express from "express";
import cors from "cors";
import {connectDB} from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import dailyLogRoutes from "./routes/dailyLogRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import {notFound,errorHandler} from "./middleware/errorMiddleware.js";

const app=express();
app.use(cors({origin:process.env.CLIENT_URL||"http://localhost:3000"}));
app.use(express.json({limit:"5mb"}));
app.get("/api/health",(_req,res)=>res.json({ok:true}));
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/projects",projectRoutes);
app.use("/api/daily-logs",dailyLogRoutes);
app.use("/api/materials",materialRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/audit",auditRoutes);
app.use(notFound);
app.use(errorHandler);

const port=process.env.PORT||5000;
connectDB().then(()=>app.listen(port,()=>console.log(`API: http://localhost:${port}`))).catch(e=>{console.error(e);process.exit(1);});
