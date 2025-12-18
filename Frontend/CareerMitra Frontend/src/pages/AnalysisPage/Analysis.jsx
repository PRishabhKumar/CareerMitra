import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../Home/Navbar";
import Loader from "../Home/Loader";
import "./Styles/AnalysisStyle.css";
import { useNavigate } from "react-router-dom";

function Analysis() {
  const router = useNavigate()
  const location = useLocation();
  const { extractedText, JD } = location.state || {};
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateCode = async()=>{
    router("/code", {state: {extractedText, JD}})
  }

  const handleFetchAnalysis = async () => {
    try {
      setLoading(true);
      setMessage("Analyzing your profile...");
      setErrorMessage("");

      const token = localStorage.getItem("token");

      // Using port 3000 to match Home.jsx configuration
      const res = await axios.post(
        "http://localhost:3000/api/v1/users/analyze",
        {
          extractedText,
          JD,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Assuming the API returns 'report' or 'analysis' key
      console.log("This is the report : ", res.data.report);
      setReport(res.data.report || res.data.analysis || "Analysis complete.");
      setMessage(res.data.message || "Fetched analysis report successfully.");
    } catch (error) {
      console.error("Error fetching analysis:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "An unexpected error occurred while fetching the analysis."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="analysis-container">
        <div className="background-glow"></div>

        <div className="analysis-header">
          <h1 className="analysis-title">
            AI Career <span className="highlight-text">Analysis</span>
          </h1>
          <p className="analysis-subtitle">
            Get personalized insights and actionable feedback to elevate your
            career journey.
          </p>
        </div>

        <div className="mainContentContainer">
          {(message || errorMessage) && !loading && (
            <div
              className={`message-container ${
                errorMessage ? "message-error" : "message-success"
              }`}
            >
              {errorMessage ? (
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
              ) : (
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
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
              <span>{errorMessage || message}</span>
            </div>
          )}

          {loading ? (
            <div className="loader-wrapper">
              <Loader />
              <p style={{ marginTop: "2rem", color: "var(--text-secondary)" }}>
                Gathering insights from your resume...
              </p>
            </div>
          ) : !report ? (
            <div className="prompt-card">
              <div className="prompt-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.4 1.5-3.8 0-3.2-2.7-5.7-6-5.7S6 4.5 6 7.7c0 1.4.5 2.8 1.5 3.8.8.8 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              </div>
              <h2 style={{ fontSize: "1.5rem", margin: 0 }}>
                Ready to Analyze?
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>
                Click below to generate a detailed AI report based on your
                uploaded resume and job description.
              </p>
              <button className="analyze-btn" onClick={handleFetchAnalysis}>
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
                  className="btn-icon"
                >
                  <path
                    d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"
                    style={{ display: "none" }}
                  />
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  <path d="M20 3v4" />
                  <path d="M22 5h-4" />
                </svg>
                Generate Report
              </button>
            </div>
          ) : (
            <div className="report-content">
              <div className="report-card">{report}</div>
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <button
                  className="analyze-btn"
                  onClick={handleFetchAnalysis}
                  style={{ margin: "0 auto" }}
                >
                  Regenerate
                </button>
                <button onClick={handleGenerateCode}>Get Refined Document using AI</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Analysis;
