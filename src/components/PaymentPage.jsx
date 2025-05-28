// frontend-sewa-villa/src/components/PaymentPage.jsx
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
import "../styles/Payment.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Pastikan variabel ini ada di .env frontend

const PaymentPage = ({ bookingId }) => {
  // Menerima bookingId sebagai prop
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [bookingData, setBookingData] = useState(
    location.state?.booking || null
  );
  const [villaTitle, setVillaTitle] = useState(
    location.state?.villaTitle || "Villa Name"
  );
  const [loading, setLoading] = useState(!bookingData);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (bookingData) {
        // Jika data sudah dilewatkan melalui state, tidak perlu fetch
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
            // Coba ambil nama villa jika tidak tersedia dari state
            const villaRes = await fetch(
              `<span class="math-inline">\{BASE\_URL\}/api/villas/</span>{currentBooking.villaId}`
            );
            if (villaRes.ok) {
              const villaInfo = await villaRes.json();
              setVillaTitle(villaInfo.name);
            }
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
  }, [bookingId, bookingData, token]); // Pastikan dependensi useEffect sudah benar

  const handleConfirmPayment = () => {
    if (bookingData) {
      navigate(`/confirmation/${bookingData.id}`, {
        state: { booking: bookingData },
      });
    } else {
      alert("Booking details not available to proceed.");
    }
  };

  if (loading)
    return <p className="text-center mt-5">Loading payment details...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;
  if (!bookingData)
    return (
      <p className="text-center mt-5">No booking details found for payment.</p>
    );

  // Pastikan perhitungan harga sudah benar untuk tampilan
  const basePrice =
    parseFloat(bookingData.totalPrice) - parseFloat(bookingData.tax);
  const displayBasePrice = `Rp. ${basePrice.toLocaleString("id-ID")}`;
  const displayCityTax = `Rp. ${parseFloat(bookingData.tax).toLocaleString(
    "id-ID"
  )}`;
  const displayTotalPrice = `Rp. ${parseFloat(
    bookingData.totalPrice
  ).toLocaleString("id-ID")}`;

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
          <h5 className="villa-title">{villaTitle}</h5>
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

        {/* Ringkasan Harga */}
        <h5 className="form-title mt-4">YOUR PRICE SUMMARY</h5>
        <div className="summary-rows">
          <div className="summary-row">
            <span>Villa Price</span>
            <span>
              <strong>{displayBasePrice}</strong>
            </span>
          </div>
          <div className="summary-row">
            <span>City Tax</span>
            <span>
              <strong>{displayCityTax}</strong>
            </span>
          </div>
          <div className="summary-row">
            <span>Total</span>
            <span>
              <strong>{displayTotalPrice}</strong>
            </span>
          </div>
        </div>

        {/* Bagian Kontak sebagai Kartu */}
        <div className="upload-section">
          <p>
            <strong>CONTACT VILLA OWNER</strong>
          </p>
          <div className="contact-card">
            <a
              href="https://wa.me/62122334556"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>+62 122 334 556</strong>
            </a>
          </div>
        </div>

        <button className="PaymentPage-button" onClick={handleConfirmPayment}>
          Proceed to Confirmation
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
