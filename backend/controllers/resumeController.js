import { PDFDocument } from "pdf-lib";
import Resume from "../models/Resume.js";
import fs from "fs/promises";
import path from "path";
import {
  extractBasicInfo,
  extractTextFromPdf,
  extractRawSections,
} from "../utils/utils.js";
import { processWithGemini } from "../utils/geminiUtils.js";

// Upload resume and begin processing
export const uploadResume = async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "uploads", req.file.filename);
    const newResume = new Resume({ filePath, userEmail: req.body.email });

    // Saving initial MongoDB entry
    const savedResume = await newResume.save();

    // Extract basic information from the PDF
    const fileBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const pdfText = await extractTextFromPdf(pdfDoc);
    const basicInfo = extractBasicInfo(pdfText);

    // Extracting raw projects and experience sections
    const { rawProjects, rawExperience } = extractRawSections(pdfText);

    // Update MongoDB with basic info and raw sections
    savedResume.basicInfo = basicInfo;
    savedResume.advancedInfo = {
      projects: rawProjects,
      experience: rawExperience,
    };
    await savedResume.save();

    // Offload advanced processing (projects and experience) to Gemini
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
