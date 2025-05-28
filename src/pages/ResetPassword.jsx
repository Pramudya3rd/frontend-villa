import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reset-password.css";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate(); // <-- for navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage("Both password fields are required.");
      setIsError(true);
    } else if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsError(true);
    } else {
      setIsError(false);
      setMessage("");

      // logika ubah passwordnya disini

      navigate("/password-updated");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h4 className="reset-password-title">Reset Your Password</h4>

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
          <div className="form-group text-start mb-3">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="form-control reset-password-input"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group text-start mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control reset-password-input"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="reset-password-btn">
            Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
