import React, { useState } from "react";
import "./Styles/AuthStyle.css"; // Reuse existing styles
import axios from "axios";
import server from "../../environment.js";

function ForgotPassword() {
  const [emailID, setEmailID] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post(`${server}/api/v1/users/forgot-password`, {
        emailID,
      });
      setMessage(res.data.message || "Password reset link sent to your email.");
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="bg-gradient"></div>
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="auth-content">
        <div className="auth-form-wrapper" style={{ margin: "0 auto", width: "100%", maxWidth: "500px" }}>
          <div className="form-card animate-up">
            <div className="form-header">
              <h2 className="form-title">Forgot Password</h2>
              <p style={{ color: "#94a3b8", marginTop: "10px", textAlign: "center" }}>
                Enter your registered email ID and we will send you a link to reset your password.
              </p>
            </div>

            {message && (
              <div className="alert alert-success">
                {message}
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={emailID}
                    onChange={(e) => setEmailID(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              
              <div className="form-footer" style={{ marginTop: "20px", textAlign: "center" }}>
                <a href="/auth" style={{ color: "#d4af37", textDecoration: "none" }}>Back to Sign In</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
