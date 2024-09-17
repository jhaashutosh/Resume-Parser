import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: String,
  description: String,
  skillsUsed: [String],
  projectLinks: [String],
});

const experienceSchema = new mongoose.Schema({
  companyName: String,
  duration: String,
  startDate: Date,
  endDate: Date,
  description: String,
  skillsUsed: [String],
  achievements: [String],
});

const educationSchema = new mongoose.Schema({
  schoolName: String,
  degree: String,
  startDate: Date,
  endDate: Date,
  description: String,
});

const suggestionsSchema = new mongoose.Schema({
  projectSuggestions: Array,
  experienceSuggestions: Array,
  educationSuggestions: Array,
  achievementsSuggestions: Array,
});

const resumeSchema = new mongoose.Schema({
  filePath: String,
  userEmail: String,
  basicInfo: {
    name: String,
    email: String,
    phone: String,
    linkedin: String,
    github: String,
    skills: [String],
  },
  advancedInfo: {
    projects: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    experience: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    education: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    achievements: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
  },
  suggestions: suggestionsSchema,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resume", resumeSchema);
