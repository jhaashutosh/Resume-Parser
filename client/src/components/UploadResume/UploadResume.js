import React, { useState, useEffect } from "react";
import axios from "axios";

const ResumeResult = ({ resumeId }) => {
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/api/status/${resumeId}`);
      setResumeData(result.data);
    };

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [resumeId]);

  if (!resumeData) return <div>Loading...</div>;

  return (
    <div>
      <Card title="Basic Info" content={resumeData.basicInfo} />
      {resumeData.advancedInfo && (
        <Card title="Suggestions" content={resumeData.advancedInfo} />
      )}
    </div>
  );
};

export default ResumeResult;
