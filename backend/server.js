// server.js
import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./db";
import resumeRoutes from "./routes/resumeRoutes";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { rateLimitingMiddleware } from "./middlewares/rateLimitingMiddleware";
import cors from "cors";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

connectDB();

app.use("/api/resume", resumeRoutes);

// Rate limiting middleware
app.use(rateLimitingMiddleware);

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
