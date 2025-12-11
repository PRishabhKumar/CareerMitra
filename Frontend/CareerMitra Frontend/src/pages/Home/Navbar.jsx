import AuthContext from "../../Contexts/AuthContext.jsx";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/NavbarStyle.css";
function Navbar() {
  const router = useNavigate();
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
      router("/auth"); // redirect to the authentication route
    }
  };
  const handleGetStarted = ()=>{
    router("/auth") // redirect to the authentication page when clcked on get started
  }
  return (
    <nav className="navbar">
      {logoutMessage && <div className="messageContainer">{logoutMessage}</div>}
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <span className="logo-text">
            Career<span className="logo-highlight">Mitra</span>
          </span>
          <div className="logo-glow"></div>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <a href="#home" className="nav-item active">
            Home
          </a>
          <a href="#features" className="nav-item">
            Features
          </a>
          <a href="#resources" className="nav-item">
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
          <button onClick = {handleGetStarted} className="nav-btn-primary">Get Started</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
