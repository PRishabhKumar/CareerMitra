import { useState } from "react";
import "./Styles/HomeStyle.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Loader from "./Loader.jsx";
function Home() {
  const router = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [hasJD, setHasJD] = useState(false); // this determined if the user has a JD or not
  const [loading, setLoading] = useState(false);
  const [JD, setJD] = useState("");

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(`Selected: ${selectedFile.name}`);
      setError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setMessage(`Selected: ${droppedFile.name}`);
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    if (JD != null) {
      formData.append("jd", JD ? JD : ""); // if no JD is given then append empty string
    }
    const token = localStorage.getItem("token");

    // Simulate upload delay for effect if needed, or just delete this comment
    try {
      setMessage("Uploading...");
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/users/upload-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { resumeID } = res.data;
      console.log(res.data);
      setMessage(
        "Resume uploaded successfully! Redirecting to results page..."
      );
      setError("");
      setTimeout(() => {
        setLoading(false);
      }, 1500);
      setTimeout(() => {
        router(`/results/${resumeID}`, { state: { resumeID } });
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload. Please try again.");
      setMessage("");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="home-container">
        <div className="content-grid">
          <div className="main-content">
            <div className="hero-section">
              <h1 className="hero-title">
                Unlock Your{" "}
                <span className="highlight-text">Career Potential</span>
              </h1>
              <p className="hero-subtitle">
                AI-powered resume analysis to help you land your dream job.
                Upload your resume and get instant, actionable feedback.
              </p>
            </div>

            <div className="upload-container">
              <form className="upload-form" onSubmit={handleSubmit}>
                <div
                  className={`drop-zone ${isDragging ? "dragging" : ""} ${
                    file ? "has-file" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    hidden
                  />
                  <label htmlFor="file-upload" className="drop-zone-label">
                    <div className="icon-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </div>
                    <span className="drop-text">
                      {file
                        ? file.name
                        : "Drag & Drop or Click to Upload Resume (PDF)"}
                    </span>
                  </label>
                </div>

                <button type="submit" className="cta-button" disabled={!file}>
                  Analyze Resume
                </button>
              </form>

              {message && (
                <div className="status-message success">
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
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {message}
                </div>
              )}

              {error && (
                <div className="status-message error">
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {error}
                </div>
              )}
            </div>
            <div className="hasJDContainer">
              <h3 className="jd-question">
                Do you have a Job Description against which you want to
                calculate the ATS Score of your resume?
              </h3>
              <div className="jd-button-group">
                <button
                  className={`jd-option-button ${
                    hasJD === true ? "active" : ""
                  }`}
                  onClick={() => setHasJD(true)}
                >
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
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Yes
                </button>
                <button
                  className={`jd-option-button ${
                    hasJD === false ? "active" : ""
                  }`}
                  onClick={() => setHasJD(false)}
                >
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
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  No
                </button>
              </div>
            </div>
            {hasJD && (
              <div className="jd-input-section">
                <h3 className="jd-input-title">
                  Paste your Job Description here:
                </h3>
                <div className="jd-content-container">
                  <textarea
                    className="jd-textarea"
                    placeholder="Paste the job description here..."
                    rows="10"
                    onChange={(e) => {
                      setJD(e.target.value);
                    }}
                  ></textarea>
                </div>
              </div>
            )}
          </div>

          <div className="side-content">
            <div className="features-grid">
              <button className="feature-card">
                <div className="feature-icon">
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
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <div className="feature-info">
                  <h3>Dashboard</h3>
                  <p>Manage your applications</p>
                </div>
              </button>
              <button className="feature-card">
                <div className="feature-icon">
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
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="feature-info">
                  <h3>History</h3>
                  <p>View past analyses</p>
                </div>
              </button>
              <button className="feature-card">
                <div className="feature-icon">
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
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </div>
                <div className="feature-info">
                  <h3>Settings</h3>
                  <p>Customize preferences</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="background-glow"></div>
        {loading && (
          <>
            <div className="loaderContainer">
              <Loader />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Home;
