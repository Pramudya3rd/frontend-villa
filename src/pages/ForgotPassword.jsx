import React, { useState } from "react";
import "../styles/forgot-password.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Email is required.");
      setIsError(true);
    } else {
      setMessage("Password reset link has been sent.");
      setIsError(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h4 className="forgot-password-title">Forgot Your Password?</h4>

        {message && (
          <div
            className={`alert mb-3 py-2 px-3 ${
              isError ? "alert-danger" : "alert-success"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group text-start">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control forgot-password-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="forgot-password-btn">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
