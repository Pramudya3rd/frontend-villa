// frontend-sewa-villa/src/components/VillaBookingCard.jsx
import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaStar,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaSwimmer,
  FaUserFriends,
  FaLayerGroup,
} from "react-icons/fa";
import "../styles/VillaBookingCard.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VillaBookingCard = ({ villaId }) => {
  // Menerima villaId sebagai prop
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  // Dapatkan detail villa dari location.state jika dilewatkan dari halaman Detail
  const {
    title,
    price,
    mainImage,
    features,
    beds,
    bathrooms,
    area,
    pool,
    guests,
    floor,
  } = location.state || {};

  const [bookingDetails, setBookingDetails] = useState({
    firstName: user?.name.split(" ")[0] || "",
    lastName: user?.name.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phoneNumber: user?.phone || "",
    duration: "",
    checkInDate: "",
    checkOutDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    // Fungsi ini dipanggil ketika "Request To Book" diklik, BUKAN "Book Now" dari detail
    // Jika Anda ingin error ini muncul ketika "Book Now" diklik, masalahnya mungkin navigasi
    console.log("[DEBUG BookingCard] Requesting to book...");
    setLoading(true);
    setError(null);

    if (!token || !user) {
      setError("You must be logged in to book a villa.");
      setLoading(false);
      return;
    }
    if (!villaId || !title || !price) {
      setError("Villa details are missing. Please go back and select a villa.");
      setLoading(false);
      return;
    }

    // Validasi dasar
    if (
      !bookingDetails.firstName ||
      !bookingDetails.email ||
      !bookingDetails.phoneNumber ||
      !bookingDetails.duration ||
      !bookingDetails.checkInDate ||
      !bookingDetails.checkOutDate
    ) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    try {
      const durationValue = parseInt(bookingDetails.duration.split(" ")[0]);
      const basePrice = parseFloat(price);
      const calculatedTotalPrice = basePrice * (durationValue || 1);
      const taxPercentage = 0.1;
      const taxAmount = calculatedTotalPrice * taxPercentage;
      const finalTotalPrice = calculatedTotalPrice + taxAmount;

      const bookingData = {
        userId: user.id,
        villaId: parseInt(villaId),
        firstName: bookingDetails.firstName,
        lastName: bookingDetails.lastName,
        email: bookingDetails.email,
        phoneNumber: bookingDetails.phoneNumber,
        duration: bookingDetails.duration,
        checkInDate: bookingDetails.checkInDate,
        checkOutDate: bookingDetails.checkOutDate,
        totalPrice: finalTotalPrice,
        tax: taxAmount,
      };

      const response = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Booking created:", data);
        navigate(`/payment/${data.id}`, {
          state: {
            booking: data,
            villaTitle: title,
          },
        });
      } else {
        setError(data.message || "Failed to create booking.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Network error or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="villa-booking-container">
      {/* Kartu Villa (tampilkan data villa yang diambil/dilewatkan) */}
      <div className="villa-card">
        <img
          src={
            mainImage && mainImage.startsWith("/")
              ? BASE_URL + mainImage
              : mainImage ||
                "https://i.pinimg.com/73x/89/c1/df/89c1dfaf3e2bf035718cf2a76a16fd38.jpg"
          }
          alt="Villa"
          className="villa-image"
        />
        <div className="villa-content">
          <p className="villa-tagline">THE CHOICE OF FAMILIES</p>
          <h5 className="villa-title">{title || "Villa Name"}</h5>
          <div className="villa-rating">
            <span className="text-warning">
              <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
            </span>
            <span className="rating-text">4.9 (20 Review)</span>
          </div>
          <hr />
          <div className="villa-features">
            <div>
              <FaBed /> Beds <strong>{beds || 4}</strong>
            </div>
            <div>
              <FaBath /> Bathrooms <strong>{bathrooms || 2}</strong>
            </div>
            <div>
              <FaRulerCombined /> Area <strong>{area || "24m²"}</strong>
            </div>
            <div>
              <FaSwimmer /> Swimming Pool <strong>{pool || 1}</strong>
            </div>
            <div>
              <FaUserFriends /> Guest <strong>{guests || 6}</strong>
            </div>
            <div>
              <FaLayerGroup /> Floor <strong>{floor || 2}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Formulir Pemesanan */}
      <div className="booking-form">
        <h5 className="form-title">ENTER YOUR DETAILS</h5>
        {error && <p className="text-danger">{error}</p>}
        <div className="form-grid">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={bookingDetails.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={bookingDetails.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={bookingDetails.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={bookingDetails.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group full-width">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              placeholder="Duration (e.g., 2 Nights)"
              value={bookingDetails.duration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Check-In</label>
            <input
              type="date"
              name="checkInDate"
              value={bookingDetails.checkInDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Check-Out</label>
            <input
              type="date"
              name="checkOutDate"
              value={bookingDetails.checkOutDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button
          className="submit-button"
          onClick={handleBooking}
          disabled={loading}
        >
          {loading ? "Requesting..." : "Request To Book"}
        </button>
      </div>
    </div>
  );
};

export default VillaBookingCard;
