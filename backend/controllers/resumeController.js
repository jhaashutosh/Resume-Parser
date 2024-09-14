import Resume from "../models/Resume";
import pdfParse from "pdf-parse";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import { fork } from "child_process";
import { extractBasicInfo } from "../utils/utils";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// Upload resume and begin processing
export const uploadResume = async (req, res) => {
  try {
    // Using process.cwd() for reliable path resolution
    const filePath = path.join(process.cwd(), "uploads", req.file.filename);
    const newResume = new Resume({ filePath, userEmail: req.body.email });

    // Saving the initial MongoDB entry
    const savedResume = await newResume.save();

    // Parsing PDF (extract basic info)
    const pdfData = await pdfParse(await fs.readFile(filePath));
    const basicInfo = extractBasicInfo(pdfData.text);

    // Updating MongoDB with basic info
    savedResume.basicInfo = basicInfo;
    await savedResume.save();

    // Offload advanced processing to the worker (Gemini)
    processWithGemini(savedResume);

    res.status(200).json({
      message: "Resume uploaded and processing",
      resumeId: savedResume._id,
    });
  } catch (error) {
    res.status(500).json({ error: "Error uploading resume" });
  }
};

// Polling endpoint to check status
export const checkStatus = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Forking a child process to handle asynchronous Gemini processing
const processWithGemini = (resume) => {
  const worker = fork("./workers/geminiWorker.js");

  worker.send({ resumeId: resume._id });

  worker.on("message", async (data) => {
    const updatedResume = await Resume.findById(data.resumeId);
    updatedResume.advancedInfo = data.advancedInfo;
    updatedResume.status = "complete";
    await updatedResume.save();
  });

  worker.on("error", (err) => {
    console.error("Worker encountered an error:", err);
  });

  worker.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });
};

export { uploadResume, checkStatus };
