// frontend-sewa-villa/src/components/VillaBookingCard.jsx
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
import "../styles/VillaBookingCard.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VillaBookingCard = () => {
  // Hapus { villaId } dari props karena kita ambil dari useParams
  const { villaId } = useParams(); // Ambil villaId dari URL
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  // Data villa yang diteruskan dari DetailsVilla (atau kosong jika langsung akses URL)
  const [villaDetailsFromState, setVillaDetailsFromState] = useState(
    location.state || null
  );

  // State untuk data villa yang akan ditampilkan di card
  const [villaData, setVillaData] = useState(null);

  const [bookingDetails, setBookingDetails] = useState({
    firstName: user?.name.split(" ")[0] || "",
    lastName: user?.name.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phoneNumber: user?.phone || "",
    duration: "", // Ini akan dihitung atau diisi manual
    checkInDate: "",
    checkOutDate: "",
  });
  const [loading, setLoading] = useState(true); // Loading untuk fetch data villa
  const [bookingLoading, setBookingLoading] = useState(false); // Loading untuk proses booking
  const [error, setError] = useState(null);

  // Helper function to safely construct image URLs
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
    const fetchVillaAndPopulateForm = async () => {
      setLoading(true);
      setError(null);

      let currentVillaData = null;

      // Coba ambil dari location.state terlebih dahulu
      if (villaDetailsFromState && villaDetailsFromState.title) {
        currentVillaData = villaDetailsFromState;
      } else {
        // Jika tidak ada di state, fetch dari backend
        if (!villaId) {
          setError("Villa ID is missing in URL.");
          setLoading(false);
          return;
        }
        try {
          const response = await fetch(`${BASE_URL}/api/villas/${villaId}`);
          if (response.ok) {
            const data = await response.json();
            currentVillaData = data;
          } else {
            const errorData = await response.json();
            setError(errorData.message || "Failed to fetch villa details.");
          }
        } catch (err) {
          console.error("Error fetching villa details:", err);
          setError("Network error or server unavailable for villa details.");
        }
      }

      if (currentVillaData) {
        setVillaData(currentVillaData);
        // Set form data user jika sudah login
        if (user) {
          setBookingDetails((prev) => ({
            ...prev,
            firstName: user.name.split(" ")[0] || "",
            lastName: user.name.split(" ").slice(1).join(" ") || "",
            email: user.email || "",
            phoneNumber: user.phone || "",
          }));
        }
      } else {
        setError("Villa details could not be loaded.");
      }
      setLoading(false);
    };

    fetchVillaAndPopulateForm();
  }, [villaId, user, villaDetailsFromState]); // Tambah villaDetailsFromState ke dependencies

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    setBookingLoading(true); // Gunakan bookingLoading untuk tombol
    setError(null);

    if (!token || !user) {
      setError("You must be logged in to book a villa.");
      setBookingLoading(false);
      return;
    }
    if (!villaId || !villaData) {
      setError("Villa details are missing. Please go back and select a villa.");
      setBookingLoading(false);
      return;
    }

    // Validasi dasar form input
    if (
      !bookingDetails.firstName ||
      !bookingDetails.email ||
      !bookingDetails.phoneNumber ||
      !bookingDetails.duration ||
      !bookingDetails.checkInDate ||
      !bookingDetails.checkOutDate
    ) {
      setError("Please fill all required fields.");
      setBookingLoading(false);
      return;
    }

    // NEW: Validasi ketersediaan di Frontend sebelum Request to Book
    try {
      const checkInDate = bookingDetails.checkInDate;
      const checkOutDate = bookingDetails.checkOutDate;

      const availabilityResponse = await fetch(
        `${BASE_URL}/api/villas?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
      );
      const availableVillas = await availabilityResponse.json();

      const isVillaAvailable = availableVillas.some(
        (villa) => villa.id === parseInt(villaId)
      );

      if (!isVillaAvailable) {
        setError(
          "Villa is not available for the selected dates. Please choose different dates or another villa."
        );
        setBookingLoading(false);
        return;
      }
    } catch (availabilityError) {
      console.error("Error checking villa availability:", availabilityError);
      setError("Failed to check villa availability. Please try again.");
      setBookingLoading(false);
      return;
    }

    // Hitung total harga
    const durationValue = parseInt(bookingDetails.duration.split(" ")[0]); // Asumsi format "X Nights"
    const basePrice = parseFloat(villaData.price);
    const calculatedTotalPrice = basePrice * (durationValue || 1);
    const taxPercentage = 0.1; // 10% tax
    const taxAmount = calculatedTotalPrice * taxPercentage;
    const finalTotalPrice = calculatedTotalPrice + taxAmount;

    try {
      const bookingDataToSend = {
        userId: user.id, // Pastikan userId ada dari auth context
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
        status: "Pending", // Status awal booking
      };

      const response = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingDataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Booking created:", data);
        alert("Booking request sent! Please proceed to payment.");
        navigate(`/payment/${data.id}`, {
          state: {
            booking: data,
            villaTitle: villaData.name, // Kirim nama villa
          },
        });
      } else {
        // Tangani error spesifik dari backend (misal: villa tidak tersedia)
        if (response.status === 409) {
          // Conflict status for unavailability
          setError(
            data.message ||
              "The villa is not available for the selected dates. Please choose different dates."
          );
        } else {
          setError(data.message || "Failed to create booking.");
        }
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Network error or server unavailable during booking creation.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-5">Loading villa details for booking...</p>
    );
  if (error && !bookingLoading)
    return <p className="text-center text-danger mt-5">{error}</p>; // Tampilkan error loading
  if (!villaData)
    return (
      <p className="text-center mt-5">
        Villa details could not be loaded for booking.
      </p>
    );

  return (
    <div className="villa-booking-container">
      {/* Kartu Villa (tampilkan data villa yang diambil/dilewatkan) */}
      <div className="villa-card">
        <img
          src={getImageUrl(villaData.mainImage)}
          alt="Villa"
          className="villa-image"
        />
        <div className="villa-content">
          <p className="villa-tagline">THE CHOICE OF FAMILIES</p>
          <h5 className="villa-title">{villaData.name}</h5>
          <div className="villa-rating">
            <span className="text-warning">
              <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
            </span>
            <span className="rating-text">4.9 (20 Review)</span>
          </div>
          <hr />
          <div className="villa-features">
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
            {villaData.beds && (
              <div>
                <FaBed /> Beds <strong>{villaData.beds}</strong>
              </div>
            )}
            {villaData.bathrooms && (
              <div>
                <FaBath /> Bathrooms <strong>{villaData.bathrooms}</strong>
              </div>
            )}
            {villaData.area && (
              <div>
                <FaRulerCombined /> Area <strong>{villaData.area}</strong>
              </div>
            )}
            {villaData.pool && (
              <div>
                <FaSwimmer /> Swimming Pool <strong>{villaData.pool}</strong>
              </div>
            )}
            {villaData.guests && (
              <div>
                <FaUserFriends /> Guest <strong>{villaData.guests}</strong>
              </div>
            )}
            {villaData.floor && (
              <div>
                <FaLayerGroup /> Floor <strong>{villaData.floor}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formulir Pemesanan */}
      <div className="booking-form">
        <h5 className="form-title">ENTER YOUR DETAILS</h5>
        {error && <p className="text-danger">{error}</p>}{" "}
        {/* Tampilkan error booking/validasi */}
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
              readOnly={!!user} // Jika sudah login, tidak bisa diubah
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
              readOnly={!!user} // Jika sudah login, tidak bisa diubah
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
              readOnly={!!user} // Jika sudah login, tidak bisa diubah
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
              readOnly={!!user} // Jika sudah login, tidak bisa diubah
            />
          </div>
          <div className="form-group full-width">
            <label>Duration (e.g., 2 Nights)</label>
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
          disabled={bookingLoading} // Gunakan bookingLoading untuk tombol
        >
          {bookingLoading ? "Requesting..." : "Request To Book"}
        </button>
      </div>
    </div>
  );
};

export default VillaBookingCard;
