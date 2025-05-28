// frontend-sewa-villa/src/components/Confirmation.jsx
import React, { useState, useEffect } from "react";
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
import "../styles/Confirmation.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Pastikan variabel ini ada di .env frontend

const Confirmation = ({ bookingId }) => {
  // Menerima bookingId sebagai prop
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [bookingData, setBookingData] = useState(
    location.state?.booking || null
  );
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ambil detail booking jika tidak dilewatkan melalui state
    const fetchBookingDetails = async () => {
      if (bookingData) {
        setLoading(false);
        return;
      }
      if (!bookingId || !token) {
        setError("Booking ID or authentication token is missing.");
        setLoading(false);
        return;
      }
      try {
        // Ambil semua booking pengguna dan cari yang spesifik
        const response = await fetch(`${BASE_URL}/api/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const allBookings = await response.json();
          const currentBooking = allBookings.find(
            (b) => b.id === parseInt(bookingId)
          );
          if (currentBooking) {
            setBookingData(currentBooking);
          } else {
            setError("Booking not found.");
          }
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch booking details.");
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Network error or server unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId, bookingData, token]); // Dependensi diperbarui

  const handleFileChange = (e) => {
    setPaymentProofFile(e.target.files[0]);
  };

  const handleConfirm = async () => {
    // Dinamai ulang dari handleBooking untuk menghindari kebingungan
    setLoading(true);
    setError(null);

    if (!token) {
      setError("You must be logged in to confirm.");
      setLoading(false);
      return;
    }
    if (!bookingId || !bookingData) {
      setError("Booking details are missing. Cannot confirm.");
      setLoading(false);
      return;
    }
    if (!paymentProofFile) {
      setError("Please upload your payment proof.");
      setLoading(false);
      return;
    }

    let paymentProofUrl = "";
    try {
      const formDataImage = new FormData();
      formDataImage.append("image", paymentProofFile); // Kunci 'image' sesuai backend multer

      const uploadResponse = await fetch(`${BASE_URL}/api/upload`, {
        method: "POST",
        body: formDataImage,
      });

      const uploadData = await uploadResponse.json();
      if (uploadResponse.ok) {
        paymentProofUrl = uploadData.imageUrl;
      } else {
        setError(uploadData.message || "Failed to upload payment proof image.");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Payment proof upload error:", err);
      setError("Network error during payment proof upload.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `<span class="math-inline">\{BASE\_URL\}/api/bookings/</span>{bookingId}/payment-proof`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentProofUrl }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Payment proof uploaded successfully!");
        navigate(`/invoice/${bookingId}`, {
          state: { booking: { ...bookingData, paymentProof: paymentProofUrl } },
        });
      } else {
        setError(data.message || "Failed to confirm booking.");
      }
    } catch (err) {
      console.error("Confirmation error:", err);
      setError("Network error or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="text-center mt-5">Loading confirmation details...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;
  if (!bookingData)
    return (
      <p className="text-center mt-5">
        No booking details found for confirmation.
      </p>
    );

  return (
    <div className="villa-booking-container">
      {/* Kartu Villa (menggunakan hardcoded untuk sementara, idealnya dilewatkan dari langkah sebelumnya) */}
      <div className="villa-card">
        <img
          src="https://i.pinimg.com/73x/89/c1/df/89c1dfaf3e2bf035718cf2a76a16fd38.jpg"
          alt="Villa"
          className="villa-image"
        />
        <div className="villa-content">
          <p className="villa-tagline">THE CHOICE OF FAMILIES</p>
          <h5 className="villa-title">De Santika Nirwana</h5>
          <div className="villa-rating">
            <span className="text-warning">
              <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
            </span>
            <span className="rating-text">4.9 (20 Review)</span>
          </div>
          <hr />
          <div className="villa-features">
            <div>
              <FaBed /> Beds <strong>4</strong>
            </div>
            <div>
              <FaBath /> Bathrooms <strong>2</strong>
            </div>
            <div>
              <FaRulerCombined /> Area <strong>24m²</strong>
            </div>
            <div>
              <FaSwimmer /> Swimming Pool <strong>1</strong>
            </div>
            <div>
              <FaUserFriends /> Guest <strong>6</strong>
            </div>
            <div>
              <FaLayerGroup /> Floor <strong>2</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Ringkasan Reservasi */}
      <div className="reservation-summary">
        <h5 className="form-title">RESERVATION SUMMARY</h5>
        {error && <p className="text-danger">{error}</p>}
        <div className="summary-rows">
          <div className="summary-row">
            <span>First Name</span>
            <span>
              <strong>{bookingData.firstName}</strong>
            </span>
          </div>
          <div className="summary-row">
            <span>Email Address</span>
            <span>
              <strong>{bookingData.email}</strong>
            </span>
          </div>
          <div className="summary-row">
            <span>Phone Number</span>
            <span>
              <strong>{bookingData.phoneNumber}</strong>
            </span>
          </div>
          <div className="summary-row">
            <span>Duration</span>
            <span>
              <strong>{bookingData.duration}</strong>
            </span>
          </div>
          <div className="summary-row">
            <span>Check-In</span>
            <span>
              <strong>
                {new Date(bookingData.checkInDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </strong>
            </span>
          </div>
          <div className="summary-row">
            <span>Check-Out</span>
            <span>
              <strong>
                {new Date(bookingData.checkOutDate).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "long", year: "numeric" }
                )}
              </strong>
            </span>
          </div>
        </div>

        <div className="upload-section">
          <p>
            <strong>UPLOAD FILE PAYMENT</strong>
          </p>
          <div className="upload-box">
            <span className="upload-icon"></span>
            <input
              type="file"
              className="file-input"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <button
          className="confirmation-button"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Confirming..." : "Confirmation"}
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
