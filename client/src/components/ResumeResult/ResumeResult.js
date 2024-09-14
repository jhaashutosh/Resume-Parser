import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ResumeResult.module.scss";

const ResumeResult = ({ resumeId }) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (resumeId) {
      const interval = setInterval(async () => {
        try {
          const result = await axios.get(
            `http://localhost:3000/api/resume/status/${resumeId}`
          );
          if (result.data.status === "complete") {
            clearInterval(interval);
            setResult(result.data);
          }
        } catch (err) {
          console.error("Error fetching status:", err);
          setError("Error fetching results");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [resumeId]);

  if (!result) return <p>Loading results...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div className={styles.resumeResultContainer}>
      <h2>Resume Analysis Results</h2>
      <h3>Basic Information:</h3>
      <p>Name: {result.basicInfo.name}</p>
      <p>Email: {result.basicInfo.email}</p>
      <p>Phone: {result.basicInfo.phone}</p>

      <h3>Projects:</h3>
      <ul>
        {result.advancedInfo.projects.map((project, index) => (
          <li key={index}>
            <strong>{project.name}</strong>
            <br />
            Skills: {project.skills.join(", ")}
            <br />
            Description: {project.description}
            <br />
            Links: {project.links.join(", ")}
          </li>
        ))}
      </ul>

      <h3>Experience:</h3>
      <ul>
        {result.advancedInfo.experience.map((exp, index) => (
          <li key={index}>
            <strong>{exp.companyName}</strong>
            <br />
            Duration: {exp.duration}
            <br />
            Start Date: {exp.startDate}
            <br />
            End Date: {exp.endDate}
            <br />
            Description: {exp.description}
            <br />
            Skills: {exp.skills.join(", ")}
            <br />
            Achievements: {exp.achievements.join(", ")}
          </li>
        ))}
      </ul>

      <h3>Suggestions:</h3>
      <div className={styles.suggestions}>
        <h4>Project Suggestions:</h4>
        <ul>
          {result.suggestions.projectSuggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>

        <h4>Experience Suggestions:</h4>
        <ul>
          {result.suggestions.experienceSuggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResumeResult;
