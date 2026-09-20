import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import server from "../../environment.js";
import "./BuildResume.css";

function BuildResume() {
  const navigate = useNavigate();
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    portfolio: "",
  });
  const [otherLinks, setOtherLinks] = useState([
    { name: "", url: "" }
  ]);
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  
  const [experiences, setExperiences] = useState([
    { title: "", company: "", duration: "", description: "" }
  ]);
  
  const [projects, setProjects] = useState([
    { title: "", techStack: "", duration: "", description: "" }
  ]);

  const [templateId, setTemplateId] = useState("modern-classic");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleOtherLinkChange = (index, e) => {
    const newLinks = [...otherLinks];
    newLinks[index][e.target.name] = e.target.value;
    setOtherLinks(newLinks);
  };

  const addOtherLink = () => {
    setOtherLinks([...otherLinks, { name: "", url: "" }]);
  };
  
  const removeOtherLink = (index) => {
    const newLinks = [...otherLinks];
    newLinks.splice(index, 1);
    setOtherLinks(newLinks);
  };

  const handleExperienceChange = (index, e) => {
    const newExp = [...experiences];
    newExp[index][e.target.name] = e.target.value;
    setExperiences(newExp);
  };

  const addExperience = () => {
    setExperiences([...experiences, { title: "", company: "", duration: "", description: "" }]);
  };
  
  const removeExperience = (index) => {
    const newExp = [...experiences];
    newExp.splice(index, 1);
    setExperiences(newExp);
  };

  const handleProjectChange = (index, e) => {
    const newProj = [...projects];
    newProj[index][e.target.name] = e.target.value;
    setProjects(newProj);
  };

  const addProject = () => {
    setProjects([...projects, { title: "", techStack: "", duration: "", description: "" }]);
  };

  const removeProject = (index) => {
    const newProj = [...projects];
    newProj.splice(index, 1);
    setProjects(newProj);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      personalInfo: JSON.stringify(personalInfo),
      otherLinks: JSON.stringify(otherLinks),
      education,
      skills,
      experience: JSON.stringify(experiences),
      projects: JSON.stringify(projects)
    };

    navigate("/select-template", { state: { resumeData: formData } });
  };

  return (
    <div className="build-resume-container">
      <div className="bg-gradient"></div>
      
      <div className="form-wrapper animate-up">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/home");
            }
          }}
          className="build-back-button"
          title="Go Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="back-arrow-icon"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back</span>
          <div className="back-btn-shine"></div>
        </button>
        <div className="form-header">
          <h2>Build Your Resume</h2>
          <p>Fill in the details below to generate a professional LaTeX resume using AI.</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <svg className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>AI is crafting your perfect resume...</p>
          </div>
        ) : (
          <form className="build-resume-form" onSubmit={handleSubmit}>
            
            {/* PERSONAL INFO SECTION */}
            <div className="section-block">
              <h3>Personal Information</h3>
              <div className="grid-2-col">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" className="form-input" value={personalInfo.name} onChange={handlePersonalInfoChange} required placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" className="form-input" value={personalInfo.email} onChange={handlePersonalInfoChange} required placeholder="john@example.com" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" name="phone" className="form-input" value={personalInfo.phone} onChange={handlePersonalInfoChange} required placeholder="+1 234 567 890" />
                </div>
              </div>
              <div className="grid-2-col" style={{marginTop: "1rem"}}>
                <div className="form-group">
                  <label>GitHub Link</label>
                  <input type="text" name="github" className="form-input" value={personalInfo.github} onChange={handlePersonalInfoChange} placeholder="github.com/johndoe" />
                </div>
                <div className="form-group">
                  <label>LinkedIn Link</label>
                  <input type="text" name="linkedin" className="form-input" value={personalInfo.linkedin} onChange={handlePersonalInfoChange} placeholder="linkedin.com/in/johndoe" />
                </div>
                <div className="form-group">
                  <label>Portfolio Link</label>
                  <input type="text" name="portfolio" className="form-input" value={personalInfo.portfolio} onChange={handlePersonalInfoChange} placeholder="johndoe.com" />
                </div>
              </div>

              {/* OTHER LINKS SUBSECTION */}
              <div className="subsection" style={{ marginTop: "1.5rem" }}>
                <div className="section-header-row">
                  <h4>Other Links</h4>
                  <button type="button" className="add-btn" onClick={addOtherLink}>
                    + Add Link
                  </button>
                </div>
                {otherLinks.map((link, index) => (
                  <div key={index} className="experience-card" style={{ marginBottom: "1rem" }}>
                    {otherLinks.length > 1 && (
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeOtherLink(index)}
                        title="Remove Link"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    )}
                    <div className="grid-2-col">
                      <div className="form-group">
                        <label>Site Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-input"
                          value={link.name}
                          onChange={(e) => handleOtherLinkChange(index, e)}
                          placeholder="e.g., LeetCode, Figma"
                        />
                      </div>
                      <div className="form-group">
                        <label>URL</label>
                        <input
                          type="text"
                          name="url"
                          className="form-input"
                          value={link.url}
                          onChange={(e) => handleOtherLinkChange(index, e)}
                          placeholder="leetcode.com/johndoe"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EDUCATION SECTION */}
            <div className="section-block">
              <h3>Education</h3>
              <div className="form-group">
                <textarea
                  name="education"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="BS in Computer Science from XYZ University, 2020-2024, GPA: 3.8"
                  required
                />
              </div>
            </div>

            {/* SKILLS SECTION */}
            <div className="section-block">
              <h3>Skills</h3>
              <div className="form-group">
                <textarea
                  name="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Programming: JavaScript, Python. Frameworks: React, Node.js"
                  required
                />
              </div>
            </div>

            {/* EXPERIENCE SECTION */}
            <div className="section-block">
              <div className="section-header-flex">
                <h3>Experience</h3>
                <button type="button" className="icon-btn add-btn" onClick={addExperience} title="Add Experience">
                  + Add
                </button>
              </div>
              
              {experiences.map((exp, index) => (
                <div key={index} className="dynamic-card">
                  <div className="dynamic-card-header">
                    <h4>Experience #{index + 1}</h4>
                    {experiences.length > 1 && (
                      <button type="button" className="icon-btn remove-btn" onClick={() => removeExperience(index)}>
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid-2-col">
                    <div className="form-group">
                      <label>Job Title</label>
                      <input type="text" name="title" className="form-input" value={exp.title} onChange={(e) => handleExperienceChange(index, e)} placeholder="Software Engineer" />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input type="text" name="company" className="form-input" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} placeholder="Google" />
                    </div>
                    <div className="form-group">
                      <label>Duration</label>
                      <input type="text" name="duration" className="form-input" value={exp.duration} onChange={(e) => handleExperienceChange(index, e)} placeholder="Jan 2022 - Present" />
                    </div>
                  </div>
                  <div className="form-group" style={{marginTop: "1rem"}}>
                    <label>Description / Bullets</label>
                    <textarea name="description" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} placeholder="- Developed a new feature..." />
                  </div>
                </div>
              ))}
            </div>

            {/* PROJECTS SECTION */}
            <div className="section-block">
              <div className="section-header-flex">
                <h3>Projects</h3>
                <button type="button" className="icon-btn add-btn" onClick={addProject} title="Add Project">
                  + Add
                </button>
              </div>
              
              {projects.map((proj, index) => (
                <div key={index} className="dynamic-card">
                  <div className="dynamic-card-header">
                    <h4>Project #{index + 1}</h4>
                    {projects.length > 1 && (
                      <button type="button" className="icon-btn remove-btn" onClick={() => removeProject(index)}>
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid-2-col">
                    <div className="form-group">
                      <label>Project Title</label>
                      <input type="text" name="title" className="form-input" value={proj.title} onChange={(e) => handleProjectChange(index, e)} placeholder="E-commerce App" />
                    </div>
                    <div className="form-group">
                      <label>Tech Stack</label>
                      <input type="text" name="techStack" className="form-input" value={proj.techStack} onChange={(e) => handleProjectChange(index, e)} placeholder="React, Node, MongoDB" />
                    </div>
                    <div className="form-group">
                      <label>Duration (Optional)</label>
                      <input type="text" name="duration" className="form-input" value={proj.duration} onChange={(e) => handleProjectChange(index, e)} placeholder="Fall 2023" />
                    </div>
                  </div>
                  <div className="form-group" style={{marginTop: "1rem"}}>
                    <label>Description / Bullets</label>
                    <textarea name="description" value={proj.description} onChange={(e) => handleProjectChange(index, e)} placeholder="- Built a scalable backend API..." />
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              Proceed to Template Selection
              <svg className="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default BuildResume;
