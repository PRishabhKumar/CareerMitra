import "./Styles/resultsStyle.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
function Results() {
  const router = useNavigate(); // Changed from navigate to router to match Home.jsx variable name if preferred, or just useNavigate
  const location = useLocation();
  const { resumeID } = location.state || {};
  const [message, setMessage] = useState("");
  const [pdfType, setPdfType] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [extractionStatus, setExtractionStatus] = useState("");
  const [extractionError, setExtractionError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Animation state
  const [showContent, setShowContent] = useState(false);

  const fetchResults = async () => {
    if (!resumeID) {
      setErrorMessage("No resume ID was received.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/v1/users/resumeResults/${resumeID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      setMessage(data.message);
      setPdfType(data.pdfType);
      setExtractedText(data.extractedText);
      setExtractionStatus(data.extractionStatus);
      setShowContent(true);
    } catch (error) {
      console.log("This error occured in fetching the results : ", error);
      setErrorMessage("Failed to fetch results. Please try again.");
    }
  };
  useEffect(() => {
    fetchResults();
  }, [resumeID]);

  return (
    <div className="results-container">
      <div className="background-glow"></div>

      <div className="results-content">
        <header className="results-header">
            <h1>
                Analysis <span className="highlight-text">Results</span>
            </h1>
          <button onClick={() => router("/home")} className="back-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home
          </button>
          
        </header>
        <div className={`status-grid ${showContent ? "animate-in" : ""}`}>
          <div className="status-card">
            <div className="icon-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="status-info">
              <span className="label">PDF Type</span>
              <span className="value">{pdfType || "Analyzing..."}</span>
            </div>
          </div>

          <div className="status-card">
            <div className="icon-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div className="status-info">
              <span className="label">Status</span>
              <span
                className={`value status-${
                  extractionStatus?.toLowerCase() || "pending"
                }`}
              >
                {extractionStatus || "Processing..."}
              </span>
            </div>
          </div>
        </div>

        {(errorMessage || extractionError) && (
          <div className="error-banner animate-in">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {errorMessage || extractionError}
          </div>
        )}

        {extractedText && (
          <div className="text-display-section animate-up">
            <div className="section-header">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <h2>Extracted Content</h2>
            </div>
            <div className="custom-scrollbar text-content">{extractedText}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;
