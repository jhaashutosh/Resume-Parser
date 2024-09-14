import { fork } from "child_process";
import Resume from "../models/Resume.js";

export const processWithGemini = (resume) => {
  const worker = fork("../workers/geminiWorker.js");

  worker.send({ resumeId: resume._id });

  worker.on("message", async (data) => {
    const updatedResume = await Resume.findById(data.resumeId);
    updatedResume.advancedInfo = data.advancedInfo;
    updatedResume.suggestions = data.suggestions;
    updatedResume.status = "complete";
    await updatedResume.save();
  });

  worker.on("error", (err) => {
    console.error("Worker encountered an error:", err);
  });

  worker.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });
};
