import React from "react";
import "../styles/error.css";

const ErrorPage = ({ code, title, description }) => {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-code">{code}</h1>
        <h2 className="error-title">{title}</h2>
        <p className="error-description">{description}</p>
      </div>
    </div>
  );
};

export default ErrorPage; 
