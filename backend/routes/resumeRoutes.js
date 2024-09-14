import express from "express";
import { uploadResume, checkStatus } from "../controllers/resumeController.js";
const router = express.Router();

// endpoint to handle uploading resumes
router.post("/upload", uploadResume);

// Polling endpoint to check the status of a resume
router.get("/status/:id", checkStatus);

export default router;
