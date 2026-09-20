import React from "react";
import AuthContext from "../../Contexts/AuthContext.jsx";
import { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Styles/NavbarStyle.css";
function Navbar() {
  const router = useNavigate();
  const location = useLocation();
  const [logoutMessage, setLogoutMessage] = useState("");
  const { handleLogout } = useContext(AuthContext);
  const handleLogoutButtonClick = async () => {
    if (localStorage.getItem("token")) {
      // this handles logout when the user is already logged in
      await handleLogout();
      console.log("User logged out successfully !!!");
      setLogoutMessage("You are successfully logged off...");
      setTimeout(() => {
        setLogoutMessage(""); // remove the message after some time to make the container disappear automatically
      }, 2000);
      router("/"); // redirect to the landing page
    } else {
      // this part handles login
      router("/auth", { state: { formState: 0 } }); // redirect to the authentication route with login state
    }
  };
  const handleGetStarted = () => {
    router("/auth", { state: { formState: 1 } }); // redirect to the authentication page with register state
  };
  return (
    <nav className="navbar">
      {logoutMessage && <div className="messageContainer">{logoutMessage}</div>}
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <Link to="/">
            <span className="logo-text">
              Career<span className="logo-highlight">Mitra</span>
            </span>
          </Link>
          <div className="logo-glow"></div>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          {/* Display the home page nav link only if the user is logged in */}
          {localStorage.getItem("token") && (
            <>
              <Link
                to="/home"
                className={`nav-item ${location.pathname === "/home" ? "active" : ""}`}
              >
                Home
              </Link>
              <Link
                to="/preview"
                className={`nav-item ${location.pathname === "/preview" ? "active" : ""}`}
              >
                Edit Resume
              </Link>
              <Link
                to="/build-resume"
                className={`nav-item ${location.pathname === "/build-resume" ? "active" : ""}`}
              >
                Build Resume
              </Link>
            </>
          )}
          <Link
            to="/features"
            className={`nav-item ${location.pathname === "/features" ? "active" : ""}`}
          >
            Features
          </Link>
          <a href="/#resources" className="nav-item">
            Resources
          </a>
        </div>

        {/* Action Buttons */}
        <div className="navbar-actions">
          <button
            className="nav-btn-secondary"
            onClick={handleLogoutButtonClick}
          >
            {localStorage.getItem("token") ? "Log out" : "Log In"}
          </button>
          <button onClick={handleGetStarted} className="nav-btn-primary">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
