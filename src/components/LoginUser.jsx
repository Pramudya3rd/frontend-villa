// frontend-sewa-villa/src/components/LoginUser.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginImg from "../assets/login.jpg";
import "../styles/login.css";
import { useAuth } from "../context/AuthContext"; // Import useAuth

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth(); // Gunakan fungsi login dari AuthContext

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Hapus error sebelumnya

    if (!email || !password) {
      setError("Email dan password harus diisi.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        login(data); // Simpan info user dan token di context dan localStorage

        // Alihkan berdasarkan peran
        if (data.role === "admin") {
          navigate("/admin");
        } else if (data.role === "owner") {
          navigate("/owner");
        } else {
          navigate("/homepage");
        }
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan jaringan atau server tidak tersedia.");
    }
  };

  return (
    <div className="login-container d-flex vh-100">
      <div
        className="left-side d-none d-md-block"
        style={{
          flex: 1,
          backgroundImage: `url(${LoginImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div
        className="right-side d-flex justify-content-center align-items-center p-4"
        style={{ flex: 1 }}
      >
        <div className="login-form w-100" style={{ maxWidth: "400px" }}>
          <h3 className="text-center mb-4 fw-bold text-dark">LOGIN</h3>

          {error && (
            <div className="alert alert-danger py-2 px-3" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control rounded-3"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control rounded-3 pe-5"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "1rem",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#6c757d",
                  }}
                >
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </span>
              </div>
            </div>

            <div className="text-end mb-3">
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "0.9rem",
                  color: "#34495e",
                  textDecoration: "none",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-lg rounded-3 text-white"
                style={{ backgroundColor: "#5e869e" }}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
