import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Home/Navbar";
import Loader from "../Home/Loader";
import "./Styles/AnalysisStyle.css";

function Analysis() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetchAnalysis = async () => {
    try {
      setLoading(true);
      setMessage("Analyzing your profile...");
      setErrorMessage("");

      const token = localStorage.getItem("token");

      // Using port 3000 to match Home.jsx configuration
      const res = await axios.post(
        "http://localhost:3000/api/v1/users/analyze",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Assuming the API returns 'report' or 'analysis' key
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
      <Navbar />
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
                  <path d="M2 12h5"></path>
                  <path d="M7 12l2 2 4-4"></path>
                  <path d="M21 12h-5"></path>
                  <path d="M12 2v5"></path>
                  <path d="M12 17v5"></path>
                  <circle cx="12" cy="12" r="10"></circle>
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
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
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
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Analysis;
