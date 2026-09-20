import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import server from "../../environment.js";
import "./TemplateSelection.css";

const templateOptions = [
  {
    id: "modern-classic",
    title: "Modern Classic (Jake's Resume)",
    description: "The industry standard. Features a clean, single-column layout with elegant serif/sans typography, strict horizontal dividers, and perfect date alignments. Designed for maximum readability by ATS scanners.",
    audience: "Software Engineers, Data Analysts, Corporate Roles",
    badge: "100% ATS",
    imgUrl: "https://placehold.co/600x848/111111/d4af37?text=Modern+Classic%5Cn(Single+Column)" 
  },
  {
    id: "tech-minimalist",
    title: "Tech Minimalist",
    description: "Sleek and modern sans-serif aesthetics (Helvetica). Uses subtle colored accents, generous whitespace, and a clean structural hierarchy.",
    audience: "Startups, Tech, Product Managers, UI/UX",
    badge: "Startups / Tech",
    imgUrl: "https://placehold.co/600x848/111111/3b82f6?text=Tech+Minimalist%5Cn(Sans-Serif+Clean)"
  },
  {
    id: "harvard-executive",
    title: "Harvard Executive",
    description: "A highly sophisticated traditional serif layout. Features centered headers, distinguished small-caps section titles, and formal pipe separators.",
    audience: "Finance, Consulting, Legal, Academia",
    badge: "Finance / Law",
    imgUrl: "https://placehold.co/600x848/111111/e2e8f0?text=Harvard+Executive%5Cn(Centered+Header)"
  },
  {
    id: "modern-sidebar",
    title: "Modern Two-Column",
    description: "A dynamic split-column layout (30% left / 70% right). Segregates contact info and skills to a sidebar to maximize space for detailed experience bullets.",
    audience: "Designers, Creatives, Specialists",
    badge: "Design / Creative",
    imgUrl: "https://placehold.co/600x848/111111/10b981?text=Modern+Sidebar%5Cn(Two-Column)"
  }
];

function TemplateSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedTemplate, setSelectedTemplate] = useState("modern-classic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resumeData = location.state?.resumeData;

  if (!resumeData) {
    return (
      <div className="template-selection-container">
        <div className="ts-error-state">
          <h2>No Resume Data Found</h2>
          <p>Please fill out the resume details first.</p>
          <button onClick={() => navigate("/build-resume")} className="ts-btn ts-btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    const payload = {
      ...resumeData,
      templateId: selectedTemplate
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${server}/api/v1/users/build-resume`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const generatedCode = res.data.code;
      navigate("/preview", { state: { latexCode: generatedCode } });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "An error occurred while generating the resume."
      );
      setLoading(false);
    }
  };

  return (
    <div className="template-selection-container">
      <div className="bg-gradient"></div>
      
      <div className="ts-header animate-up">
        <button
          type="button"
          onClick={() => navigate("/build-resume")}
          className="build-back-button"
          title="Go Back"
          style={{ position: 'absolute', left: '2rem', top: '2rem' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="back-arrow-icon">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back</span>
          <div className="back-btn-shine"></div>
        </button>

        <h1>Choose Your Design</h1>
        <p>Select a template that best highlights your professional narrative.</p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
          {error}
        </div>
      )}

      <div className="ts-grid animate-up" style={{ animationDelay: '0.1s' }}>
        {templateOptions.map((tpl) => (
          <div 
            key={tpl.id}
            className={`ts-card ${selectedTemplate === tpl.id ? 'active' : ''}`}
            onClick={() => setSelectedTemplate(tpl.id)}
          >
            <div className="ts-card-image-wrapper">
              <img src={tpl.imgUrl} alt={tpl.title} className="ts-card-image" />
              <div className="ts-card-overlay">
                <div className="ts-select-circle">
                  {selectedTemplate === tpl.id && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
              </div>
            </div>
            <div className="ts-card-content">
              <div className="ts-card-header">
                <h3>{tpl.title}</h3>
                <span className="ts-badge">{tpl.badge}</span>
              </div>
              <p className="ts-description">{tpl.description}</p>
              <div className="ts-audience">
                <strong>Best For:</strong> {tpl.audience}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="ts-footer animate-up" style={{ animationDelay: '0.2s' }}>
        <button 
          className="ts-submit-btn" 
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              Generating your resume...
            </span>
          ) : (
            <span className="flex items-center">
              Generate Resume
              <svg className="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default TemplateSelection;
