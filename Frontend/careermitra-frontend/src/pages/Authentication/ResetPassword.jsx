import React, { useState } from "react";
import "./Styles/AuthStyle.css"; // Reuse existing styles
import axios from "axios";
import server from "../../environment.js";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post(`${server}/api/v1/users/reset-password/${token}`, {
        password,
      });
      setMessage(res.data.message || "Password has been reset successfully.");
      setLoading(false);
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. The token may be invalid or expired."
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
              <h2 className="form-title">Reset Password</h2>
              <p style={{ color: "#94a3b8", marginTop: "10px", textAlign: "center" }}>
                Enter your new password below.
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
                <label className="form-label">New Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
