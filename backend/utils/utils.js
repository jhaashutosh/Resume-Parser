import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
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
    const uint8Array = new Uint8Array(fileBuffer);

    const loadingTask = getDocument({ data: uint8Array });
    const pdfDocument = await loadingTask.promise;
    let extractedText = "";

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();

      textContent.items.forEach((item) => {
        extractedText += item.str + " ";
      });
    }

    return extractedText;
  } catch (err) {
    console.error("Error extracting text from PDF:", err);
    throw err;
  }
};

export const generatePrompt = (
  userPrompt,
  projects,
  experience,
  education,
  achievements
) => {
  if (userPrompt !== null && userPrompt !== undefined && userPrompt !== "") {
    const prompt =
      `${userPrompt}` +
      `\n\n I have extracted the following resume details for your ease: \n\n Projects: ${JSON.stringify(
        projects
      )}` +
      `\n\n Experience: ${JSON.stringify(experience)}` +
      `\n\n Education: ${JSON.stringify(education)}` +
      `\n\n Achievements: ${JSON.stringify(achievements)}`;
    return prompt;
  }
  const prompt = `
      Analyze the following resume data:
      Projects: ${JSON.stringify(projects)}
      Experience: ${JSON.stringify(experience)}
      Education: ${JSON.stringify(education)}
      Achievements: ${JSON.stringify(achievements)}

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
        "processedEducation": [
          {
            "schoolName": String,
            "degree": String,
            "startDate": Date,
            "endDate": Date,
            "description": String
          }
        ],
        "processedAchievements": [
          {
            "achievement": String
          }
        ],
        "projectSuggestions": [],
        "experienceSuggestions": [],
        "educationSuggestions": [],
        "achievementsSuggestions": []
      }
      Remember to return data with maximum 300 words. This condition is to be followed strictly.
      If there is no data for projects, experience, education, or achievements, return empty arrays for processedProjects, processedExperience, processedEducation, and processedAchievements, and do not provide suggestions for those fields.
    `;
  return prompt;
};
