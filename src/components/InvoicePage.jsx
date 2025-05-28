// frontend-sewa-villa/src/components/InvoicePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Invoice.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Pastikan variabel ini ada di .env frontend

const InvoicePage = ({ bookingId }) => {
  // Menerima bookingId sebagai prop
  const location = useLocation();
  const { token } = useAuth();
  const [bookingData, setBookingData] = useState(
    location.state?.booking || null
  );
  const [loading, setLoading] = useState(!bookingData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Jika bookingData tidak dilewatkan melalui state, coba fetch
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
            setError("Invoice not found.");
          }
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch invoice details.");
        }
      } catch (err) {
        console.error("Error fetching invoice details:", err);
        setError("Network error or server unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId, bookingData, token]);

  const handleDownloadInvoice = () => {
    alert(
      "Fungsi download invoice akan diimplementasikan di sini. Ini mungkin melibatkan backend untuk menghasilkan PDF."
    );
    // Implementasi PDF generation/download logic di sini (biasanya memerlukan library di backend)
  };

  if (loading) return <p className="text-center mt-5">Loading invoice...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;
  if (!bookingData)
    return <p className="text-center mt-5">No invoice details found.</p>;

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
    <div className="invoice-container">
      <div className="invoice-box">
        <h2 className="invoice-title">RESERVATION SUMMARY</h2>

        <div className="reservation-details">
          <div className="reservation-row">
            <span className="label">First Name</span>
            <span className="value">
              <strong>{bookingData.firstName}</strong>
            </span>
          </div>
          <div className="reservation-row">
            <span className="label">Email Address</span>
            <span className="value">
              <strong>{bookingData.email}</strong>
            </span>
          </div>
          <div className="reservation-row">
            <span className="label">Phone Number</span>
            <span className="value">
              <strong>{bookingData.phoneNumber}</strong>
            </span>
          </div>
          <div className="reservation-row">
            <span className="label">Duration</span>
            <span className="value">
              <strong>{bookingData.duration}</strong>
            </span>
          </div>
          <div className="reservation-row">
            <span className="label">Check-In</span>
            <span className="value">
              <strong>
                {new Date(bookingData.checkInDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </strong>
            </span>
          </div>
          <div className="reservation-row">
            <span className="label">Check-Out</span>
            <span className="value">
              <strong>
                {new Date(bookingData.checkOutDate).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "long", year: "numeric" }
                )}
              </strong>
            </span>
          </div>
        </div>

        <div className="price-summary">
          <h3 className="price-title">YOUR PRICE SUMMARY</h3>

          <div className="reservation-row">
            <span className="label">Villa Rental</span>
            <span className="value">
              <strong>{displayBasePrice}</strong>
            </span>
          </div>
          <div className="reservation-row">
            <span className="label">City Tax</span>
            <span className="value">
              <strong>{displayCityTax}</strong>
            </span>
          </div>
          <div className="reservation-row total">
            <span className="label">Total</span>
            <span className="value">
              <strong>{displayTotalPrice}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="download-container">
        <button className="download-btn" onClick={handleDownloadInvoice}>
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
