import "./styles/landingPageStyles.css";
import Navbar from "../Home/Navbar.jsx";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="landing-page-wrapper">
      {/* Background Ambience */}
      <div className="landing-bg-glow"></div>
      <div className="landing-bg-grid"></div>

      <div className="landing-container">
        {/* HERO SECTION */}
        <section className="landing-hero">
          <div className="hero-content">
            <h1 className="landing-title">
              Master Your Career <br />
              <span className="text-gold">With AI Precision</span>
            </h1>
            <p className="landing-subtitle">
              Transform your job search with instant resume analysis, ATS
              optimization, and personalized feedback powered by advanced
              artificial intelligence.
            </p>
            <div className="hero-cta-group">
              <Link to={localStorage.getItem("token") ? "/home" : "/auth"} className="btn-primary-gold">
                Analyze My Resume
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <button className="btn-secondary-outline">View Demo</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-card-stack">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                alt="Collaborative Team"
                className="visual-img main-img"
              />
              <div className="visual-card-sub stack-card-1">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                  alt="Analytics Dashboard"
                />
              </div>
              <div className="floating-badge badge-1">
                <div className="badge-icon-premium icon-silver">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div className="badge-text">
                  <span>ATS Score</span>
                  <strong>98/100</strong>
                </div>
              </div>
              <div className="floating-badge badge-2">
                <div className="badge-icon-premium icon-platinum">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="badge-text">
                  <span>Match Rate</span>
                  <strong>High</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES TEASER */}
        <section className="landing-features">
          <div className="section-header">
            <h2 className="section-title">
              Why Choose <span className="text-gold">CareerMitra?</span>
            </h2>
          </div>
          <div className="features-grid-landing">
            {/* Feature 1 */}
            <div className="glass-card feature-tile">
              <div className="tile-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3>Instant Analysis</h3>
              <p>
                Get immediate actionable feedback on your resume structure and
                content.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card feature-tile">
              <div className="tile-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3>ATS Compliance</h3>
              <p>
                Ensure your resume passes automated screening systems used by
                top companies.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card feature-tile">
              <div className="tile-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h3>Smart Insights</h3>
              <p>
                Leverage AI to uncover hidden keywords and skills missing from
                your profile.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="landing-steps">
          <h2 className="section-title center">How It Works</h2>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-visual">
                <div className="step-ring-outer"></div>
                <div className="step-ring-inner">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
              </div>
              <h4>Upload Resume</h4>
              <p>Drag & drop your existing PDF resume.</p>
            </div>
            <div className="step-connector">
              <div className="connector-line"></div>
              <div className="connector-dot"></div>
            </div>
            <div className="step-item step-ai-scanning">
              <div className="step-visual">
                <div className="step-ring-outer delay-1"></div>
                <div className="step-ring-inner">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <div className="scan-line"></div>
                </div>
                <div className="scan-ripple"></div>
              </div>
              <h4>AI Scanning</h4>
              <p>Our engine analyzes every detail.</p>
            </div>
            <div className="step-connector">
              <div className="connector-line"></div>
              <div className="connector-dot delay-1"></div>
            </div>
            <div className="step-item">
              <div className="step-visual">
                <div className="step-ring-outer delay-2"></div>
                <div className="step-ring-inner">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
              </div>
              <h4>Get Results</h4>
              <p>Receive a detailed report & score.</p>
            </div>
          </div>
        </section>

        {/* DISCLAIMER / TRUST */}
        <section className="landing-trust">
          <p>
            Powered by advanced Large Language Models for human-level
            understanding.
          </p>
        </section>

        {/* CTA FOOTER */}
        <section className="landing-footer-cta">
          <div className="footer-glow"></div>
          <h2>Ready to Land Your Dream Job?</h2>
          <p>Join thousands of job seekers optimizing their careers today.</p>
          <Link to="/auth" className="btn-primary-gold large">
            Get Started for Free
          </Link>
        </section>
      </div>
    </div>
  );
}

export default LandingPage;
