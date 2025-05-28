// frontend-sewa-villa/src/components/NavbarProfile.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../styles/main.css";
import { useAuth } from "../context/AuthContext"; // Import useAuth

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Dapatkan user dan fungsi logout dari AuthContext

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); // Hapus info user dan token dari context dan localStorage
    setShowDropdown(false);
    navigate("/");
  };

  // Tentukan link profil berdasarkan peran user
  let profileLink = "/profile";
  if (user) {
    if (user.role === "admin") {
      profileLink = "/admin";
    } else if (user.role === "owner") {
      profileLink = "/owner";
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-lightblue py-3">
      <div className="container d-flex align-items-center justify-content-between">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          LOGO
        </Link>

        <div className="collapse navbar-collapse justify-content-center">
          <ul className="navbar-nav mb-2 mb-lg-0 gap-4">
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/">
                HOME
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/about">
                ABOUT US
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/our-villa">
                OUR VILLA
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/faq">
                FAQ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/contact">
                CONTACT
              </Link>
            </li>
          </ul>
        </div>

        {/* Ikon Profil & Dropdown */}
        <div className="profile-icon position-relative" ref={dropdownRef}>
          <FaUserCircle
            size={32}
            className="text-dark cursor-pointer"
            onClick={toggleDropdown}
          />

          {showDropdown && (
            <div className="dropdown-menu show position-absolute end-0 mt-2 shadow bg-white rounded py-2">
              <Link className="dropdown-item px-4 py-2" to={profileLink}>
                Dashboard
              </Link>{" "}
              {/* Link ke dashboard */}
              <Link className="dropdown-item px-4 py-2" to="/profile">
                Profile
              </Link>{" "}
              {/* Link ke profil pengguna */}
              <button
                className="dropdown-item px-4 py-2 text-start"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
