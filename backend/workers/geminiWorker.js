import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import Resume from "../models/Resume.js";
import { connectDB } from "../db.js";
import { generatePrompt } from "../utils/utils.js";

dotenv.config();

process.on("message", async (msg) => {
  const { resumeId } = msg;

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      candidateCount: 1,
      maxOutputTokens: 1500,
      temperature: 1.0,
    },
  });

  try {
    await connectDB();

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      throw new Error("Resume not found");
    }

    const { advancedInfo } = resume;
    const { projects = [], experience = [] } = advancedInfo || {};

    const prompt = generatePrompt(projects, experience);

    const res = await model.generateContent(prompt);

    const result = res.response.text();

    console.log("Result:", result);

    if (result.includes("json")) {
      const jsonString = result.substring(
        result.indexOf("{"),
        result.lastIndexOf("}") + 1
      );
      const parsedResult = JSON.parse(jsonString);
      console.log("Parsed JSON Response:", parsedResult);
      const {
        processedProjects = [],
        processedExperience = [],
        projectSuggestions = [],
        experienceSuggestions = [],
      } = parsedResult;

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
    } else {
      console.error("Unexpected format or error:", result);
    }
  } catch (error) {
    console.error("Error processing with Generative AI:", error);
    process.send({ error: error.message });
  }
});
