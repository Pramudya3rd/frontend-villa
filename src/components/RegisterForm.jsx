// frontend-sewa-villa/src/components/RegisterForm.jsx
import React, { useState } from "react";
import RegisterImg from "../assets/Register.png";
import "../styles/register.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tambahkan validasi form dasar di sini
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.role
    ) {
      alert("Semua field harus diisi.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Pendaftaran berhasil! Silakan login.");
        console.log("Registered user:", data);
        navigate("/login"); // Alihkan ke halaman login setelah pendaftaran berhasil
      } else {
        alert(data.message || "Pendaftaran gagal. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Terjadi kesalahan jaringan atau server tidak tersedia.");
    }
  };

  return (
    <div className="register-container d-flex vh-100">
      <div
        className="left-side d-none d-md-block"
        style={{
          flex: 1,
          backgroundImage: `url(${RegisterImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div
        className="right-side d-flex justify-content-center align-items-center p-4"
        style={{ flex: 1 }}
      >
        <div className="register-form w-100" style={{ maxWidth: "400px" }}>
          <h3 className="text-center mb-4 fw-bold text-dark">REGISTER</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control rounded-3"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control rounded-3"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control rounded-3"
                name="phone"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
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
                  className="form-control rounded-3"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                />
                <span
                  onClick={togglePassword}
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

            {/* Role */}
            <div className="mb-4">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <select
                name="role"
                className="form-select rounded-3"
                value={form.role}
                onChange={handleChange}
              >
                <option value="">Select role</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="user">User</option> {/* Tambahkan opsi user */}
              </select>
            </div>

            {/* Submit */}
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-lg rounded-3 text-white"
                style={{ backgroundColor: "#5e869e" }}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
