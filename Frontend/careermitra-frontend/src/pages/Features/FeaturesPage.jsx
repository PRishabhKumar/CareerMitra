import React from "react";
import "./Styles/FeaturesPageStyle.css";

const FeaturesPage = () => {
  const features = [
    {
      id: 1,
      title: "AI Resume Analysis",
      desc: "Deep scan your resume against industry standards with our advanced ATS scoring engine.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14 2z" />
          <path d="M14 2v6h6" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </svg>
      ),
      size: "large", // spans 2 cols
    },
    {
      id: 2,
      title: "Smart Keywords",
      desc: "Bridge the gap between your skills and job descriptions with instant, data-driven keyword suggestions.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      size: "medium",
    },
    {
      id: 3,
      title: "Live LaTeX Preview",
      desc: "Experience real-time rendering. See your resume transform instantly as you edit code.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      ),
      size: "medium",
    },
    {
      id: 4,
      title: "PDF Compilation",
      desc: "Generate strict ATS-compliant PDF resumes with a single click. Professional, clean, and ready to apply.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
      size: "medium",
    },
    {
      id: 5,
      title: "AI Career Assistant",
      desc: "A dedicated intelligent assistant to help refine your bullet points, answer career queries, and guide your journey.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
      size: "large",
    },
    {
      id: 6,
      title: "Market Insights",
      desc: "Stay ahead with real-time analysis of salary trends and skill demands in your target industry.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
      ),
      size: "medium",
    },
  ];

  return (
    <div className="features-page">
      {/* Brand Aligned Background */}
      <div className="features-background">
        <div className="top-glow"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="features-content">
        <div className="features-hero">
          <h1 className="hero-title">
            Unlock Your <span className="highlight-text">Career Potential</span>
          </h1>
          <p className="hero-subtitle">
            Precision tools designed for the modern professional. Craft the
            perfect resume and fast-track your success.
          </p>
        </div>

        <div className="features-bento-grid">
          {features.map((feature) => (
            <div key={feature.id} className={`feature-card ${feature.size}`}>
              <div className="card-icon-wrapper">{feature.icon}</div>
              {/* Spacer is handled by flex space-between, or margin-top on title */}
              <div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-desc">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
