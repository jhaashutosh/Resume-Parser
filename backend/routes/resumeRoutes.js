import express from "express";
import { uploadResume, checkStatus } from "../controllers/resumeController.js";
const router = express.Router();
import uploadMiddleware from "../middlewares/uploadMiddleware.js";

// endpoint to handle uploading resumes
router.post("/upload", uploadMiddleware, uploadResume);

// Polling endpoint to check the status of a resume
router.get("/status/:id", checkStatus);

export default router;
