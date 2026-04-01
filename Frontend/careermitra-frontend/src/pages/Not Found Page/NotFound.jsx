import React from "react";
import "./Styles/NotFoundStyles.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import robotImage from "../../images/not_found_robot.png"; // Importing the generated image

function NotFound() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/home");
  };

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="image-wrapper">
          <img src={robotImage} alt="Confused Robot" className="robot-image" />
          <div className="shadow-oval"></div>
        </div>

        <div className="text-content">
          <h1 className="oops-title">Oops!</h1>
          <p className="message">It looks like even our AI is confused.</p>
          <p className="sub-message">
            The page you are looking for is lost in the matrix.
          </p>
        </div>

        <button onClick={goToHome} className="home-btn">
          <ArrowLeft size={20} />
          <span>Take Me Home</span>
        </button>
      </div>
    </div>
  );
}

export default NotFound;
