import Resume from "../models/Resume.js";
import {
  extractBasicInfo,
  extractTextFromPdf,
  extractSections,
} from "../utils/utils.js";
import { processWithGemini } from "../utils/geminiUtils.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.fileBuffer || !(req.fileBuffer instanceof Buffer)) {
      return res.status(400).json({ error: "Invalid file buffer" });
    }

    const userPrompt = req.body.userPrompt || null;

    const fileBuffer = req.fileBuffer;
    const pdfText = await extractTextFromPdf(fileBuffer);
    const basicInfo = extractBasicInfo(pdfText);

    const { projects, experience, education, achievements } =
      extractSections(pdfText);

    const newResume = new Resume({
      basicInfo,
      advancedInfo: {
        projects: projects || [],
        experience: experience || [],
        education: education || [],
        achievements: achievements || [],
      },
    });

    const result = await processWithGemini(newResume, userPrompt);

    res.status(200).json({
      message: "Resume parsed successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: `Error uploading resume: ${error.message}` });
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
