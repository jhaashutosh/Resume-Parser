import { GenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import Resume from "../models/Resume.js";

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const generativeAI = new GenerativeAI({
  apiKey: GOOGLE_API_KEY,
});

process.on("message", async (msg) => {
  const { resumeId } = msg;

  try {
    const resume = await Resume.findById(resumeId).lean();

    if (!resume) {
      throw new Error("Resume not found");
    }

    const { advancedInfo } = resume;
    const { projects, experience } = advancedInfo;

    const requestPayload = {
      projects,
      experience,
    };

    const response = await generativeAI.generate({
      prompt:
        "Extract detailed project and experience information, and provide suggestions.",
      context: requestPayload,
    });

    const {
      processedProjects,
      processedExperience,
      projectSuggestions,
      experienceSuggestions,
    } = response;

    process.send({
      resumeId,
      advancedInfo: {
        projects: processedProjects,
        experience: processedExperience,
      },
      suggestions: {
        projectSuggestions,
        experienceSuggestions,
      },
    });
  } catch (error) {
    console.error("Error processing with Generative AI:", error);
    process.send({ error: error.message });
  }
});
