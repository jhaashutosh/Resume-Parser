import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./db.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { rateLimitingMiddleware } from "./middlewares/rateLimitingMiddleware.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

connectDB();

// Rate limiting middleware
app.use(rateLimitingMiddleware);

// Error handling middleware
app.use(errorMiddleware);

// Define routes with middleware
app.use("/api/resume", resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
