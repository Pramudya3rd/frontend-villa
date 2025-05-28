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

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Confirmation = ({ bookingId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [bookingData, setBookingData] = useState(
    location.state?.booking || null
  );
  const [villaData, setVillaData] = useState(null); // NEW: State for villa details
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [loading, setLoading] = useState(true); // Set true initially as we fetch data
  const [error, setError] = useState(null);

  // Helper function to safely construct image URLs (copy from Detail.jsx or make a utility)
  const getImageUrl = (path) => {
    if (!path) {
      return "https://i.pinimg.com/73x/89/c1/df/89c1dfaf3e2bf035718cf2a76a16fd38.jpg";
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
  }, [bookingId, bookingData, token]); // Add villaData to dependencies

  const handleFileChange = (e) => {
    setPaymentProofFile(e.target.files[0]);
  };

  const handleConfirm = async () => {
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
        `${BASE_URL}/api/bookings/${bookingId}/payment-proof`, // BARIS YANG DIPERBAIKI
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
        alert(
          "Payment proof uploaded successfully! Your booking is being processed."
        );
        navigate(`/invoice/${bookingId}`, {
          state: { booking: { ...bookingData, paymentProof: paymentProofUrl } },
        });
      } else {
        console.error("Backend error during booking confirmation:", data);
        setError(data.message || "Failed to confirm booking. Server error.");
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
        No booking details found for confirmation. Please ensure you came from
        the payment page.
      </p>
    );

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
              accept="image/*" // Hanya terima file gambar
            />
          </div>
          {paymentProofFile && (
            <p className="mt-2 text-success">
              File selected: {paymentProofFile.name}
            </p>
          )}
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
