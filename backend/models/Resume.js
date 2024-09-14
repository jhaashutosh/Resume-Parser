import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  filePath: String,
  userEmail: String,
  basicInfo: {
    name: String,
    email: String,
    phone: String,
    linkedin: String,
    github: String,
    projects: Array,
    experience: Array,
    skills: Array,
  },
  advancedInfo: {
    suggestedEducation: String,
    suggestedExperience: String,
    suggestedProjects: Array,
  },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Resume", resumeSchema);
