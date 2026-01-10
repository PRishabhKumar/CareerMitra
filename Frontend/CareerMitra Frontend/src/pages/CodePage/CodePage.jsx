import React, { useState, useEffect } from "react";
import "./Styles/CodePageStyle.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import server from "../../environment.js"


function CodePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { extractedText, JD } = location.state || {}; // Ensure case matches what triggers this page
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    getCode();
  }, []);

  const getCode = async () => {
    // If no text, maybe don't call? Or let backend handle it.
    if (!extractedText) {
      // Optional: might want to handle missing data case, but for now proceeding.
    }

    setLoading(true);
    try {
      const res = await axios.post(`${server}/api/v1/users/code`, {
        extractedText: extractedText,
        JD: JD,
      });
      const fetchedCode = res.data.code;
      setCode(fetchedCode);
      setMessage(res.data.message || "Refined doc fetched successfully...");
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("There was some error in fetching the refined document...");
      }
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="code-page-container">
      <div className="background-glow"></div>

      <div className="content-wrapper">
        <header className="page-header animate-in">
          <button onClick={() => navigate(-1)} className="back-button">
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
            Back
          </button>
          <div className="title-wrapper">
            <h1>
              Refined <span className="highlight-text">Resume Code</span>
            </h1>
            <p className="subtitle">
              AI-generated LaTeX/Markdown code optimized for your target job.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="loading-container animate-up">
            <div className="loader"></div>
            <p>Generating your refined code...</p>
          </div>
        ) : error ? (
          <div className="error-banner animate-up">
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
            {error}
          </div>
        ) : (
          <div className="code-editor-card animate-up">
            <div className="editor-header">
              <div className="window-controls">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="filename">resume_refined.tex</div>
              <button
                className={`copy-button ${copySuccess ? "success" : ""}`}
                onClick={handleCopy}
              >
                {copySuccess ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy Code
                  </>
                )}
              </button>
            </div>
            <div className="editor-content custom-scrollbar">
              <pre>
                <code>{code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodePage;
