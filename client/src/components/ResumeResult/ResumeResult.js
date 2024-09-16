import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ResumeResult.module.scss";

const ResumeResult = ({ resumeId }) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (resumeId) {
      const interval = setInterval(async () => {
        try {
          console.log("Trying with this id: ", resumeId);
          const result = await axios.get(
            `http://localhost:3000/api/resume/status/${resumeId}`
          );
          if (result.data.status === "complete") {
            clearInterval(interval);
            setStatus("complete");
            setResult(result.data);
          } else {
            setResult(result.data);
          }
        } catch (err) {
          console.error("Error fetching status:", err);
          setError("Error fetching results");
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [resumeId]);

  if (!result) return <p>Loading results...</p>;

  if (error) return <p>{error}</p>;

  const basicInfo = result.basicInfo || {};
  const advancedInfo = result.advancedInfo || { projects: [], experience: [] };
  const suggestions = result.suggestions || {
    projectSuggestions: [],
    experienceSuggestions: [],
  };

  return (
    <div className={styles.resumeResultContainer}>
      <h2>Resume Analysis Results</h2>
      <h3>Basic Information:</h3>
      <p>Name: {basicInfo.name || ""}</p>
      <p>Email: {basicInfo.email || ""}</p>
      <p>Phone: {basicInfo.phone || ""}</p>

      <h3>Projects:</h3>
      {status === "complete" ? (
        <ul>
          {advancedInfo.projects.length ? (
            advancedInfo.projects.map((project, index) => (
              <li key={index}>
                <strong>{project.name || ""}</strong>
                <br />
                Skills: {project.skills?.join(", ") || ""}
                <br />
                Description: {project.description || ""}
                <br />
                Links: {project.links?.join(", ") || ""}
              </li>
            ))
          ) : (
            <li>No projects available</li>
          )}
        </ul>
      ) : (
        <p>loading...</p>
      )}

      <h3>Experience:</h3>
      {status === "complete" ? (
        <ul>
          {advancedInfo.experience.length ? (
            advancedInfo.experience.map((exp, index) => (
              <li key={index}>
                <strong>{exp.companyName || ""}</strong>
                <br />
                Duration: {exp.duration || ""}
                <br />
                Start Date: {exp.startDate || ""}
                <br />
                End Date: {exp.endDate || ""}
                <br />
                Description: {exp.description || ""}
                <br />
                Skills: {exp.skills?.join(", ") || ""}
                <br />
                Achievements: {exp.achievements?.join(", ") || ""}
              </li>
            ))
          ) : (
            <li>No experience available</li>
          )}
        </ul>
      ) : (
        <p>loading...</p>
      )}

      <h3>Suggestions:</h3>
      <div className={styles.suggestions}>
        <h4>Project Suggestions:</h4>
        <ul>
          {suggestions.projectSuggestions.length ? (
            suggestions.projectSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion || ""}</li>
            ))
          ) : (
            <li>No project suggestions available</li>
          )}
        </ul>

        <h4>Experience Suggestions:</h4>
        <ul>
          {suggestions.experienceSuggestions.length ? (
            suggestions.experienceSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion || ""}</li>
            ))
          ) : (
            <li>No experience suggestions available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ResumeResult;
