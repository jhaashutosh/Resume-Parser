import React, { useState } from "react";
import "./UploadResume.css"; // Import a CSS file for styling

function UploadResume() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);
    setResult(data);
  };

  return (
    <div className="container">
      <h1>Resume Parser</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {result && (
        <div className="result">
          <h3>Parsed Resume:</h3>
          <div className="result-section">
            <h4>Name:</h4>
            <p>{result.name || "N/A"}</p>
          </div>
          <div className="result-section">
            <h4>Address:</h4>
            <p>{result.address || "N/A"}</p>
          </div>
          <div className="result-section">
            <h4>LinkedIn:</h4>
            <p>
              <a
                href={result.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.linkedIn}
              </a>
            </p>
          </div>
          <div className="result-section">
            <h4>GitHub:</h4>
            <p>
              <a href={result.github} target="_blank" rel="noopener noreferrer">
                {result.github}
              </a>
            </p>
          </div>
          <div className="result-section">
            <h4>Skills:</h4>
            <ul>
              {result.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          <div className="result-section">
            <h4>Projects:</h4>
            {result.projects.map((project, index) => (
              <div key={index}>
                <strong>{project.title}</strong>
                <p>{project.description}</p>
                {project.link !== "N/A" && (
                  <p>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.link}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="result-section">
            <h4>Experience:</h4>
            {result.experience.map((exp, index) => (
              <div key={index}>
                <strong>{exp.title}</strong>
                <p>{exp.description}</p>
                {exp.link !== "N/A" && (
                  <p>
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {exp.link}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="result-section">
            <h4>Education:</h4>
            {result.education.map((edu, index) => (
              <div key={index}>
                <strong>{edu.title}</strong>
                <p>{edu.description}</p>
                {edu.link !== "N/A" && (
                  <p>
                    <a
                      href={edu.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {edu.link}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="result-section">
            <h4>Achievements:</h4>
            <ul>
              {result.achievements.map((ach, index) => (
                <li key={index}>{ach}</li>
              ))}
            </ul>
          </div>
          <div className="result-section">
            <h4>Certifications:</h4>
            <ul>
              {result.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
          <div className="result-section">
            <h4>Publications:</h4>
            {result.publications.map((pub, index) => (
              <div key={index}>
                <strong>{pub.title}</strong>
                <p>{pub.description}</p>
                {pub.link !== "N/A" && (
                  <p>
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {pub.link}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="result-section">
            <h4>Hobbies:</h4>
            <ul>
              {result.hobbies.map((hobby, index) => (
                <li key={index}>{hobby}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadResume;