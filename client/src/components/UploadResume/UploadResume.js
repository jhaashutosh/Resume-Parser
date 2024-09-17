import React, { useState } from "react";
import axios from "axios";
import ResumeResult from "../ResumeResult/ResumeResult";
import styles from "./UploadResume.module.scss";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      selectedFile.type === "application/pdf" &&
      selectedFile.size <= 2 * 1024 * 1024
    ) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file smaller than 2MB.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("userPrompt", userPrompt);

    try {
      const result = await axios.post(
        "http://localhost:3000/api/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResumeData(result.data.data);
    } catch (err) {
      setError("Error uploading resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.uploadResumeContainer}>
      <h1>Get ATS Score</h1>
      <input
        placeholder="Upload Resume before clicking the button"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <input
        type="text"
        placeholder="Enter your prompt here..."
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
      />
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? "Uploading..." : "Upload Resume"}
      </button>
      {error && <p className={styles.error}>{error}</p>}
      {resumeData && !loading ? <ResumeResult resumeData={resumeData} /> : null}
    </div>
  );
};

export default UploadResume;
