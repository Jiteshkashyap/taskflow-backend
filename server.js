import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from'cors';
import compression from "compression";
import helmet from 'helmet';

import connectDb from'./config/db.js';
import "./config/redis.js"


import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

import { errorMiddleware } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running "
  });
});



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/tasks", taskRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Global error handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 8081;


const startServer = async () => {
  try {
    await connectDb()

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
