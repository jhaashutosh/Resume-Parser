import pdf from "pdf-parse";
import nlp from "compromise";
import { removeStopwords } from "stopword";

export const extractBasicInfo = (text) => {
  const doc = nlp(text);

  const nameLines = text.split("\n").slice(0, 3).join(" ");
  const names = doc.people().out("array");
  const fullName = names.length
    ? names[0]
    : nameLines.match(/([A-Z][a-z]*\s?){2,}/)?.[0];

  const emailRegex = /[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/;
  const phoneRegex = /\(?\+?(\d{1,3})?\)?[\s-]?\d{10}/;
  const githubRegex = /github\.com\/([A-Za-z0-9_-]+)/i;
  const linkedinRegex = /linkedin\.com\/in\/([A-Za-z0-9_-]+)/i;
  const skillsRegex = /SKILLS\s*([\s\S]*?)EXPERIENCE/i;

  const skillsText = (text.match(skillsRegex) || [])[1]?.trim();
  const skillWords = skillsText ? skillsText.split(/[\s,]+/) : [];
  const cleanedSkills = removeStopwords(skillWords);

  return {
    name: fullName || "Name not found",
    email: (text.match(emailRegex) || [])[0],
    phone: (text.match(phoneRegex) || [])[0],
    github: (text.match(githubRegex) || [])[0],
    linkedin: (text.match(linkedinRegex) || [])[0],
    skills: cleanedSkills,
  };
};

export const extractSections = (text) => {
  const sectionMapping = {
    education: ["education", "academics", "school", "university", "degree"],
    projects: ["projects", "portfolio", "work samples", "case studies"],
    experience: [
      "experience",
      "career",
      "job",
      "work",
      "employment",
      "professional experience",
    ],
    achievements: [
      "achievements",
      "awards",
      "responsibilities",
      "recognitions",
      "accomplishments",
    ],
  };

  const sections = {};

  Object.keys(sectionMapping).forEach((section) => {
    const variations = sectionMapping[section].join("|");
    const regex = new RegExp(
      `(${variations})\\s*([\\s\\S]*?)(?=(${Object.values(sectionMapping)
        .flat()
        .join("|")}|$))`,
      "i"
    );

    sections[section] = (text.match(regex) || [])[2]?.trim() || null;
  });

  return sections;
};

export const extractTextFromPdf = async (fileBuffer) => {
  try {
    const data = await pdf(fileBuffer);
    return data.text;
  } catch (err) {
    console.log(err);
  }
};

export const generatePrompt = (projects, experience) => {
  const prompt = `
      Analyze the following resume data:
      Projects: ${JSON.stringify(projects)}
      Experience: ${JSON.stringify(experience)}

      Provide the response in the following JSON format:
      {
        "processedProjects": [
          {
            "projectName": String,
            "description": String,
            "skillsUsed": [String],
            "projectLinks": [String]
          }
        ],
        "processedExperience": [
          {
            "companyName": String,
            "duration": String,
            "startDate": Date,
            "endDate": Date,
            "description": String,
            "skillsUsed": [String],
            "achievements": [String]
          }
        ],
        "projectSuggestions": [],
        "experienceSuggestions": []
      }
      Remember to return data with maximum 300 words.
      If there is no data for projects or experience, return empty arrays for processedProjects and processedExperience, and do not provide suggestions for those fields.
    `;
  return prompt;
};
