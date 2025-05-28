import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/password-updated.css";

const PasswordUpdated = () => {
  const navigate = useNavigate();

  const handleBackToSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="password-updated-container">
      <div className="password-updated-card">
        <h4 className="password-updated-title">Password Updated</h4>
        <p className="password-updated-description">
          Password changed successfully!
        </p>

        <button
          className="back-to-signin-btn"
          onClick={handleBackToSignIn}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default PasswordUpdated;
