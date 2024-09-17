import styles from "./ResumeResult.module.scss";
import React, { useEffect, useState } from "react";

const ResumeResult = ({ resumeData }) => {
  const [isDatajson, setIsDataJson] = useState(false);
  useEffect(() => {
    if (resumeData && typeof resumeData !== "string") {
      setIsDataJson(true);
    } else {
      setIsDataJson(false);
    }
  }, [resumeData]);

  if (!resumeData) {
    return null;
  }

  function formatResumeData(text) {
    if (!text || typeof text !== "string") {
      return null;
    }

    try {
      const escapeHTML = (str) => {
        const map = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        };
        return str.replace(/[&<>"']/g, (m) => map[m]);
      };

      let formattedText = escapeHTML(text)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");

      formattedText = formattedText.replace(/\n/g, "<br />");

      formattedText = formattedText
        .replace(/\n\* (.*?)(?=\n|$)/g, "<li>$1</li>")
        .replace(/<li>(.*?)<\/li>/g, "<ul><li>$1</li></ul>")
        .replace(/<\/ul>\n<ul>/g, "");

      return formattedText;
    } catch (error) {
      console.error("Error formatting resume data:", error);
      return "Error displaying the resume data.";
    }
  }

  const formattedResumeData = formatResumeData(resumeData);

  return (
    <div className={styles.resumeResultContainer}>
      <h2>Resume Analysis Results</h2>
      <div dangerouslySetInnerHTML={{ __html: formattedResumeData }} />
      {isDatajson && <p>{JSON.stringify(resumeData)}</p>}
    </div>
  );
};

export default ResumeResult;
