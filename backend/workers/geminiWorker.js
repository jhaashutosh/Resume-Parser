process.on("message", async (msg) => {
  const { resumeId } = msg;

  //using Gemini API to process the resume sections
  const advancedInfo = await geminiApi.processResumeSections(resumeId);

  // Send the processed data back to the main process
  process.send({ resumeId, advancedInfo });
});
