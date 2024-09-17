import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import Resume from "../models/Resume.js";
import { generatePrompt } from "../utils/utils.js";

dotenv.config();

export const processWithGemini = async (resume, userPrompt) => {
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
    if (!resume) {
      throw new Error("Resume not found");
    }

    const { advancedInfo, basicInfo } = resume;
    const {
      projects = [],
      experience = [],
      education = [],
      achievements = [],
    } = advancedInfo || {};

    const prompt = generatePrompt(
      userPrompt,
      projects,
      experience,
      education,
      achievements
    );

    const res = await model.generateContent(prompt);

    const result = res.response.text();

    if (userPrompt) {
      return result;
    } else if (result.includes("json")) {
      const jsonString = result.substring(
        result.indexOf("{"),
        result.lastIndexOf("}") + 1
      );
      const parsedResult = JSON.parse(jsonString);
      const {
        processedProjects = [],
        processedExperience = [],
        processedEducation = [],
        processedAchievements = [],
        projectSuggestions = [],
        experienceSuggestions = [],
        educationSuggestions = [],
        achievementsSuggestions = [],
      } = parsedResult;

      const finalResult = {
        basicInfo,
        advancedInfo: {
          projects: processedProjects,
          experience: processedExperience,
          education: processedEducation,
          achievements: processedAchievements,
        },
        suggestions: {
          projectSuggestions,
          experienceSuggestions,
          educationSuggestions,
          achievementsSuggestions,
        },
        status: "complete",
      };

      if (!userPrompt) {
        const finalResume = new Resume({
          ...finalResult,
        });
        await finalResume.save();
      }
      return finalResult;
    } else {
      console.error("Unexpected format or error:", result);
    }
  } catch (error) {
    console.error("Error processing with Generative AI:", error);
    process.send({ error: error.message });
  }
};
