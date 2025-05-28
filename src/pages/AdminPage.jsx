import React, { useState, useEffect } from "react";
import NavbarProfile from "../components/NavbarProfile";
import "../styles/admin.css";
import { useAuth } from "../context/AuthContext";
import { FiEye } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("manage-villas");
  const [villas, setVillas] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [currentVillaFilterStatus, setCurrentVillaFilterStatus] =
    useState("Pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();

  // Helper function to safely construct image URLs
  const getImageUrl = (path) => {
    if (!path) {
      return "https://placehold.co/100x80/cccccc/000000?text=No+Image";
    }
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${normalizedPath}`;
  };

  // Fungsi untuk mengambil semua villa dari backend
  const fetchVillas = async () => {
    if (!token || !user || user.role !== "admin") {
      setLoading(false);
      setError(
        "Not authenticated or authorized as admin. Please login with an admin account."
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/villas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setVillas(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch villas.");
      }
    } catch (err) {
      console.error("Error fetching all villas:", err);
      setError("Network error or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil semua booking dari backend (hanya admin)
  const fetchBookings = async () => {
    if (!token || !user || user.role !== "admin") {
      setLoading(false);
      setError(
        "Not authenticated or authorized as admin. Please login with an admin account."
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Menggunakan endpoint /api/bookings/admin-all
      const response = await fetch(`${BASE_URL}/api/bookings/admin-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch bookings.");
      }
    } catch (err) {
      console.error("Error fetching all bookings:", err);
      setError("Network error or server unavailable."); // Ini pesan yang Anda lihat
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeMenu === "manage-villas") {
      fetchVillas();
    } else if (activeMenu === "manage-bookings") {
      fetchBookings();
    }
  }, [activeMenu, token, user]);

  const filteredVillas = villas.filter((villa) => {
    if (currentVillaFilterStatus === "All") return true;
    return villa.status === currentVillaFilterStatus;
  });

  const filteredBookings = bookings;

  const updateVillaStatus = async (villaId, status) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/villas/${villaId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        alert(`Villa status updated to ${status}.`);
        fetchVillas();
      } else {
        const errorData = await response.json();
        alert(
          errorData.message || `Failed to update villa status to ${status}.`
        );
      }
    } catch (err) {
      console.error("Update villa status error:", err);
      alert("Network error or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVilla = (villaId) =>
    updateVillaStatus(villaId, "Approved");
  const handleRejectVilla = (villaId) => updateVillaStatus(villaId, "Rejected");

  const updateBookingStatus = async (bookingId, status) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        alert(`Booking status updated to ${status}.`);
        fetchBookings();
      } else {
        const errorData = await response.json();
        alert(
          errorData.message || `Failed to update booking status to ${status}.`
        );
      }
    } catch (err) {
      console.error("Update booking status error:", err);
      alert("Network error or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = (bookingId) =>
    updateBookingStatus(bookingId, "Confirmed");
  const handleRejectBooking = (bookingId) =>
    updateBookingStatus(bookingId, "Cancelled");

  if (loading) return <p className="text-center mt-5">Loading dashboard...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  return (
    <div>
      <NavbarProfile />
      <div className="admin-container">
        <div className="admin-sidebar">
          <ul>
            <li
              className={activeMenu === "manage-villas" ? "active" : ""}
              onClick={() => setActiveMenu("manage-villas")}
              style={{ cursor: "pointer" }}
            >
              MANAGE VILLAS
            </li>
            <li
              className={activeMenu === "manage-bookings" ? "active" : ""}
              onClick={() => setActiveMenu("manage-bookings")}
              style={{ cursor: "pointer" }}
            >
              MANAGE BOOKINGS
            </li>
            <li
              className={activeMenu === "profile" ? "active" : ""}
              onClick={() => setActiveMenu("profile")}
              style={{ cursor: "pointer" }}
            >
              PROFIL
            </li>
          </ul>
        </div>
        <div className="admin-content">
          {activeMenu === "manage-villas" && (
            <>
              <h4>Manage Villas</h4>
              <div className="filter-buttons mb-3">
                <button
                  className={`btn ${
                    currentVillaFilterStatus === "Pending"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  } me-2`}
                  onClick={() => setCurrentVillaFilterStatus("Pending")}
                >
                  Pending
                </button>
                <button
                  className={`btn ${
                    currentVillaFilterStatus === "Approved"
                      ? "btn-success"
                      : "btn-outline-success"
                  } me-2`}
                  onClick={() => setCurrentVillaFilterStatus("Approved")}
                >
                  Approved
                </button>
                <button
                  className={`btn ${
                    currentVillaFilterStatus === "Rejected"
                      ? "btn-danger"
                      : "btn-outline-danger"
                  } me-2`}
                  onClick={() => setCurrentVillaFilterStatus("Rejected")}
                >
                  Rejected
                </button>
                <button
                  className={`btn ${
                    currentVillaFilterStatus === "All"
                      ? "btn-info"
                      : "btn-outline-info"
                  }`}
                  onClick={() => setCurrentVillaFilterStatus("All")}
                >
                  All
                </button>
              </div>

              <div className="villa-table">
                <table>
                  <thead>
                    <tr>
                      <th>Villa Name</th>
                      <th>Address</th>
                      <th>Owner ID</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVillas.length > 0 ? (
                      filteredVillas.map((villa) => (
                        <tr key={villa.id}>
                          <td>{villa.name}</td>
                          <td>{villa.location}</td>
                          <td>{villa.ownerId}</td>
                          <td>{villa.status}</td>
                          <td>
                            <button
                              className="btn-approve"
                              onClick={() => handleApproveVilla(villa.id)}
                              disabled={loading || villa.status === "Approved"}
                            >
                              Approve
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => handleRejectVilla(villa.id)}
                              disabled={loading || villa.status === "Rejected"}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No villas{" "}
                          {currentVillaFilterStatus === "All"
                            ? ""
                            : `with status "${currentVillaFilterStatus}"`}{" "}
                          to manage.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeMenu === "manage-bookings" && (
            <>
              <h4>Manage Bookings</h4>
              <div className="villa-table">
                <table>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>User Name</th>
                      <th>Villa Name</th>
                      <th>Check-In</th>
                      <th>Check-Out</th>
                      <th>Total Price</th>
                      <th>Status</th>
                      <th>Proof</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>{booking.id}</td>
                          <td>{booking.userName || "N/A"}</td>
                          <td>{booking.villaTitle || "N/A"}</td>
                          <td>
                            {new Date(booking.checkInDate).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          <td>
                            {new Date(booking.checkOutDate).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          <td>
                            Rp.{" "}
                            {parseFloat(booking.totalPrice).toLocaleString(
                              "id-ID"
                            )}
                          </td>
                          <td
                            className={`status-${
                              booking.status
                                ? booking.status.toLowerCase().replace(" ", "-")
                                : "pending"
                            }`}
                          >
                            {booking.status}
                          </td>
                          <td>
                            {booking.paymentProof ? (
                              <a
                                href={getImageUrl(booking.paymentProof)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FiEye title="View Proof" />
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td>
                            <button
                              className="btn-approve"
                              onClick={() => handleApproveBooking(booking.id)}
                              disabled={
                                loading ||
                                booking.status === "Confirmed" ||
                                booking.status === "Cancelled"
                              }
                            >
                              Approve
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => handleRejectBooking(booking.id)}
                              disabled={
                                loading ||
                                booking.status === "Confirmed" ||
                                booking.status === "Cancelled"
                              }
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No bookings to manage.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeMenu === "profile" && (
            <div>
              <h2>Admin Profile Section</h2>
              <p>
                Ini konten profil admin. Anda bisa mengambil data profil dari
                AuthContext.
              </p>
              {user && (
                <div>
                  <p>Name: {user.name}</p>
                  <p>Email: {user.email}</p>
                  <p>Role: {user.role}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
