import React from 'react'
import "./Styles/AuthStyle.css";
import { useState, useContext } from "react";
import { useRef } from "react";
import AuthContext from "../../Contexts/AuthContext.jsx";
import httpStatus from "http-status";
import { useNavigate } from "react-router-dom";

function Auth() {
  const router = useNavigate();
  const containerRef = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailID, setEmailID] = useState("");
  const [formState, setFormState] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    await handleAuthentication();
    console.log("Form submitted : ", {
      username,
      password,
      phoneNumber,
      emailID,
    });
  };
  const { handleRegister, handleLogin } = useContext(AuthContext);

  const handleAuthentication = async () => {
    try {
      // login
      if (formState == 0) {
        let result = await handleLogin(username, password);
        setMessage("User authenticated successfully..");
        setError("");
        setUsername(username);
        setPassword(password);
      }
      //register
      else {
        let result = await handleRegister(
          username,
          password,
          phoneNumber,
          emailID
        );
        setMessage("User registered successfully...");
        setError("");
        setUsername(username);
        setPassword(password);
        setPhoneNumber(phoneNumber);
        setEmailID(emailID);
        setTimeout(() => {
          router("/home"); // redirect to the home page after 2 seconds
        }, 2000);
      }
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
      setMessage("");
    }
  };

  const toggleForm = () => {
    setFormState(formState === 0 ? 1 : 0);
    setMessage("");
    setError("");
    setUsername("");
    setPassword("");
    setPhoneNumber("");
    setEmailID("");
  };

  return (
    <div className="auth-container">
      {/* Animated Background */}
      <div className="bg-gradient"></div>
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Main Content */}
      <div className="auth-content" ref={containerRef}>
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="brand-content">
            <h1 className="brand-title">
              Welcome to <span className="brand-highlight">CareerMitra</span>
            </h1>
            <p className="brand-subtitle">
              Your AI-powered career companion for resume perfection
            </p>
            <div className="brand-features">
              <div className="feature">
                <div className="feature-icon">📄</div>
                <span>AI Resume Analysis</span>
              </div>
              <div className="feature">
                <div className="feature-icon">🎯</div>
                <span>ATS Optimization</span>
              </div>
              <div className="feature">
                <div className="feature-icon">⚡</div>
                <span>Instant Feedback</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-wrapper">
          <div className="form-card">
            <div className="form-header">
              <h2 className="form-title">
                {formState === 0 ? "Sign In" : "Create Account"}
              </h2>
            </div>

            {/* Alert Messages */}
            {message && (
              <div className="alert alert-success">
                <svg
                  className="alert-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {message}
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <svg
                  className="alert-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            <div className="auth-form">
              {/* Username Field */}
              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSubmit(e);
                    }}
                    required
                  />
                  <svg
                    className="input-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Email Field (Register only) */}
              {formState === 1 && (
                <div className="form-group form-group-slide-in">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Enter your email"
                      value={emailID}
                      onChange={(e) => setEmailID(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleSubmit(e);
                      }}
                      required
                    />
                    <svg
                      className="input-icon"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Phone Field (Register only) */}
              {formState === 1 && (
                <div className="form-group form-group-slide-in">
                  <label className="form-label">Phone Number</label>
                  <div className="input-wrapper">
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleSubmit(e);
                      }}
                      required
                    />
                    <svg
                      className="input-icon"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSubmit(e);
                    }}
                    required
                  />
                  <svg
                    className="input-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="submit-btn"
              >
                {formState === 0 ? "Sign In" : "Create Account"}
                <svg
                  className="btn-arrow"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Toggle Form */}
              <div className="form-footer">
                <p>
                  {formState === 0
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={toggleForm}
                  >
                    {formState === 0 ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
