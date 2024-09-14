const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

// Set up Multer storage
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("resume"), async (req, res) => {
  const file = req.file;
  let text = "";

  if (file.mimetype === "application/pdf") {
    const dataBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(dataBuffer);
    text = pdfData.text;
  } else if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: file.path });
    text = result.value;
  }

  const parsedData = parseResume(text);
  res.json(parsedData);
});

function parseResume(text) {
  return {
    name: extractName(text),
    address: extractAddress(text),
    linkedIn: extractLinkedIn(text),
    github: extractGithub(text),
    skills: extractSkills(text),
    projects: extractProjects(text),
    education: extractEducation(text),
    experience: extractExperience(text),
    achievements: extractAchievements(text),
    certifications: extractCertifications(text),
    publications: extractPublications(text),
    hobbies: extractHobbies(text),
  };
}

// Updated extraction functions with fallback handling

function extractName(text) {
  const match = text.match(/(?:Name|Full Name|Candidate):\s*(.*)/i);
  return match ? match[1].trim() : "N/A";
}

function extractAddress(text) {
  const match = text.match(/(?:Address|Location):\s*(.*)/i);
  return match ? match[1].trim() : "N/A";
}

function extractLinkedIn(text) {
  const match = text.match(/(https?:\/\/[^\s]+linkedin\.com[^\s]*)/i);
  return match ? match[0].trim() : "N/A";
}

function extractGithub(text) {
  const match = text.match(/(https?:\/\/[^\s]+github\.com[^\s]*)/i);
  return match ? match[0].trim() : "N/A";
}

function extractSkills(text) {
  const match = text.match(
    /(?:Skills|Technical Skills|Proficiencies):\s*([\s\S]*?)(?=\n\n|\n\S)/i
  );
  if (match) {
    return match[1]
      .split(/,|\n/)
      .map((skill) => skill.trim())
      .filter(Boolean);
  } else {
    // Fallback to find common skill-related terms
    const skillLines = text.match(
      /(?:HTML|CSS|JavaScript|React|Node|Python|Java|C\+\+|SQL|MongoDB)/gi
    );
    return skillLines
      ? skillLines.map((skill) => skill.trim()).filter(Boolean)
      : [];
  }
}

function extractProjects(text) {
  return extractSectionWithFallback(text, "Projects", [
    "Experience",
    "Education",
    "Achievements",
  ]);
}

function extractEducation(text) {
  return extractSectionWithFallback(text, "Education", [
    "Experience",
    "Projects",
    "Achievements",
  ]);
}

function extractExperience(text) {
  return extractSectionWithFallback(text, "Experience", [
    "Projects",
    "Education",
    "Achievements",
  ]);
}

function extractAchievements(text) {
  return extractSectionWithFallback(text, "Achievements", [
    "Experience",
    "Projects",
    "Education",
  ]);
}

function extractCertifications(text) {
  return extractSectionWithFallback(text, "Certifications", [
    "Experience",
    "Projects",
    "Education",
  ]);
}

function extractPublications(text) {
  return extractSectionWithFallback(text, "Publications", [
    "Experience",
    "Projects",
    "Education",
  ]);
}

function extractHobbies(text) {
  const match = text.match(/(?:Hobbies|Interests):\s*([\s\S]*?)(?=\n\n|\n\S)/i);
  return match
    ? match[1]
        .split(/,|\n/)
        .map((hobby) => hobby.trim())
        .filter(Boolean)
    : "N/A";
}

// Improved section extraction function with fallback
function extractSectionWithFallback(text, sectionTitle, stopTitles) {
  const regex = new RegExp(
    `${sectionTitle}:\\s*([\\s\\S]*?)(?=\\n\\n|\\n(?:${stopTitles.join(
      "|"
    )}):)`,
    "i"
  );
  const match = text.match(regex);
  if (match) {
    const sectionContent = match[1].trim();
    const items = sectionContent.split(/\n\n+/).map((item) => {
      const lines = item.split(/\n+/);
      return {
        title: lines[0] || "N/A",
        description: lines.slice(1).join(" ").trim() || "N/A",
        link: extractLink(item),
      };
    });
    return items.length > 0 ? items : sectionContent;
  }

  // Fallback: Capture any unstructured block of text under the section header
  const fallbackRegex = new RegExp(
    `${sectionTitle}\\s*([\\s\\S]*?)(?=\\n{2,}|\\n(?:${stopTitles.join(
      "|"
    )})|\\n$)`,
    "i"
  );
  const fallbackMatch = text.match(fallbackRegex);
  return fallbackMatch ? fallbackMatch[1].trim() : [];
}

// Utility function to extract a link from a text block
function extractLink(text) {
  const match = text.match(/https?:\/\/[^\s]+/);
  return match ? match[0].trim() : "N/A";
}

app.listen(3001, () => console.log("Server running on port 3001"));