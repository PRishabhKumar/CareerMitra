import React, { useRef } from "react";
import "./Styles/CodePreviewStyles.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { parse, HtmlGenerator } from "latex.js";
import { FlowButton } from "./flow-button.tsx";
import axios from "axios";
import server from "../../environment.js";

function CodePreview() {
  const location = useLocation();
  const latexCode = location.state?.latexCode;
  const navigator = useNavigate();
  const previewRef = useRef(null);
  const [code, setCode] = useState(latexCode); // Textarea value
  const [compiledCode, setCompiledCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfURL, setPdfURL] = useState("");
  const [status, setStatus] = useState("");

  const handleCompilation = async () => {
    try {
      setLoading(true);
      let res = await axios.post(
        `${server}/api/v1/users/compileLatex`,
        {
          latexCode: code,
        },
        {
          responseType: "blob", // this tells axios that the response will be binary data and not JSON
        }
      );
      const url = URL.createObjectURL(res.data);
      setPdfURL(url);
      setLoading(false);
    } catch (error) {
      console.log("This error occured : " + error);
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const link = document.createElement("a"); // create anchor tag
    link.download = "refined_resume.pdf"; // this will be the name of the download and it also the browser to not to navigate to this URL instead downlaod the file
    link.href = pdfURL; // set the target URL for the <a></a>
    document.body.appendChild(link); // add the link to the DOM
    link.click(); // click the anchor tag to trigger it
  };

  const handleClose = () => {
    URL.revokeObjectURL(pdfURL);
    navigator(-1);
  };
  return (
    <div className="latex-preview-page">
      <div className="latex-preview-container">
        <div className="latex-preview-header">
          <div className="header-title-group">
            <div className="header-icon-wrapper">
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
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
            </div>
            <h2>LaTeX Code & Preview</h2>
          </div>
          <button
            className="close-btn"
            onClick={handleClose}
            aria-label="Close"
          >
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
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </button>
        </div>

        <div className="latex-content-split">
          {/* Left Column: Raw Code */}
          <div className="latex-column code-column">
            <div className="column-header">
              <span className="column-label">Raw LaTeX Code</span>
              <div className="column-badge">Source</div>
            </div>
            <div className="code-display-container">
              <textarea
                className="code-editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                placeholder="Enter LaTeX code here..."
              />
            </div>
            <div className="compile-btn-container">
              <FlowButton text="Compile Code" onClick={handleCompilation} />
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="latex-column preview-column">
            <div className="column-header">
              <span className="column-label">Preview</span>
              <div
                className={`column-badge ${
                  !code ? "no-code" : loading ? "live" : "processing"
                }-badge`}
              >
                {!code ? "Code editor empty" : loading ? "Rendered" : "Ready"}
              </div>
            </div>
            <div className="preview-display-container">
              {loading && (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Rendering LaTeX...</p>
                </div>
              )}

              {error && (
                <div className="error-state">
                  <p>{error}</p>
                </div>
              )}

              <div
                ref={previewRef}
                className="latex-output"
                style={{ display: loading ? "none" : "block" }}
              />
              {pdfURL && (
                <iframe
                  src={`${pdfURL}#toolbar=0&navpanes=0&scrollbar=0`}
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              )}
            </div>
            <div className="download-btn-container">
              <FlowButton text="Download PDF" onClick={handleDownloadPDF} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodePreview;
