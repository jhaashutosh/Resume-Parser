import express from "express";
import resumeController from "../controllers/resumeController";
const router = express.Router();

// endpoint to handle uploading resumes
router.post("/upload", resumeController.uploadResume);

// Polling endpoint to check the status of a resume
router.get("/status/:id", resumeController.checkStatus);

export default router;
