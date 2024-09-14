import React, { useState } from "react";
import axios from "axios";
import ResumeResult from "../ResumeResult/ResumeResult";
import styles from "./UploadResume.module.scss";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [resumeId, setResumeId] = useState(null);
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
      setResumeId(result.data.resumeId);
    } catch (err) {
      setError("Error uploading resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.uploadResumeContainer}>
      <h1>Get ATS Score</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Resume"}
      </button>
      {error && <p className={styles.error}>{error}</p>}
      {resumeId && <ResumeResult resumeId={resumeId} />}
    </div>
  );
};

export default UploadResume;
