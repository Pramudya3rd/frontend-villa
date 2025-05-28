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

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PaymentPage = ({ bookingId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [bookingData, setBookingData] = useState(
    location.state?.booking || null
  );
  const [villaData, setVillaData] = useState(null); // NEW: State for villa details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to safely construct image URLs
  const getImageUrl = (path) => {
    if (!path) {
      return "https://i.pinimg.com/73x/89/c1/df/89c1dfaf3e2bf035718cf2a76a16fd38.jpg"; // Default placeholder if path is empty
    }
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${normalizedPath}`;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      let currentBooking = bookingData;
      // Fetch booking details if not available from location.state
      if (!currentBooking) {
        if (!bookingId || !token) {
          setError("Booking ID or authentication token is missing.");
          setLoading(false);
          return;
        }
        try {
          const response = await fetch(`${BASE_URL}/api/bookings/my-bookings`, {
            // Assuming this endpoint returns a list of bookings
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const allBookings = await response.json();
            currentBooking = allBookings.find(
              (b) => b.id === parseInt(bookingId)
            );
            if (currentBooking) {
              setBookingData(currentBooking);
            } else {
              setError("Booking not found or not accessible.");
              setLoading(false);
              return;
            }
          } else {
            const errorData = await response.json();
            setError(errorData.message || "Failed to fetch booking details.");
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Error fetching booking details:", err);
          setError("Network error or server unavailable for bookings.");
          setLoading(false);
          return;
        }
      }

      // Now fetch villa details using villaId from currentBooking
      if (currentBooking && currentBooking.villaId) {
        try {
          const villaRes = await fetch(
            `${BASE_URL}/api/villas/${currentBooking.villaId}`
          );
          if (villaRes.ok) {
            const villaInfo = await villaRes.json();
            setVillaData(villaInfo);
          } else {
            const errorData = await villaRes.json();
            setError(errorData.message || "Failed to fetch villa details.");
          }
        } catch (err) {
          console.error("Error fetching villa details:", err);
          setError("Network error or server unavailable for villa.");
        }
      } else {
        setError("Villa ID not found in booking data.");
      }
      setLoading(false);
    };

    fetchDetails();
  }, [bookingId, bookingData, token]); // Add villaData to dependencies to avoid re-fetching loop

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
      {/* Kartu Villa (gunakan data dari villaData) */}
      <div className="villa-card">
        <img
          src={
            villaData
              ? getImageUrl(villaData.mainImage)
              : "https://i.pinimg.com/73x/89/c1/df/89c1dfaf3e2bf035718cf2a76a16fd38.jpg"
          }
          alt="Villa"
          className="villa-image"
        />
        <div className="villa-content">
          <p className="villa-tagline">THE CHOICE OF FAMILIES</p>
          <h5 className="villa-title">{villaData?.name || "Villa Name"}</h5>
          <div className="villa-rating">
            <span className="text-warning">
              <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
            </span>
            <span className="rating-text">4.9 (20 Review)</span>
          </div>
          <hr />
          <div className="villa-features">
            {/* Tampilkan fitur dari villaData jika tersedia */}
            {villaData &&
              Array.isArray(villaData.features) &&
              villaData.features
                .filter((f) => f.trim() !== "")
                .map((feature, i) => (
                  <div key={i}>
                    {feature.toLowerCase().includes("tv") && (
                      <FaTv className="me-2" />
                    )}
                    {feature.toLowerCase().includes("wifi") && (
                      <FaWifi className="me-2" />
                    )}
                    {feature.toLowerCase().includes("air conditioner") && (
                      <FaSnowflake className="me-2" />
                    )}
                    {feature.toLowerCase().includes("heater") && (
                      <FaThermometerHalf className="me-2" />
                    )}
                    {feature.toLowerCase().includes("private bathroom") && (
                      <FaBath className="me-2" />
                    )}
                    {feature}
                  </div>
                ))}
            {/* Tampilkan detail spesifik seperti beds, bathrooms dari villaData */}
            {villaData?.beds && (
              <div>
                <FaBed /> Beds <strong>{villaData.beds}</strong>
              </div>
            )}
            {villaData?.bathrooms && (
              <div>
                <FaBath /> Bathrooms <strong>{villaData.bathrooms}</strong>
              </div>
            )}
            {villaData?.area && (
              <div>
                <FaRulerCombined /> Area <strong>{villaData.area}</strong>
              </div>
            )}
            {villaData?.pool && (
              <div>
                <FaSwimmer /> Swimming Pool <strong>{villaData.pool}</strong>
              </div>
            )}
            {villaData?.guests && (
              <div>
                <FaUserFriends /> Guest <strong>{villaData.guests}</strong>
              </div>
            )}
            {villaData?.floor && (
              <div>
                <FaLayerGroup /> Floor <strong>{villaData.floor}</strong>
              </div>
            )}
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
