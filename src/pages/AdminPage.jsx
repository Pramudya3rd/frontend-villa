import React, { useState, useEffect } from "react";
import NavbarProfile from "../components/NavbarProfile";
import "../styles/admin.css";
import { useAuth } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("manage");
  const [villas, setVillas] = useState([]); // State untuk semua villa yang diambil dari backend
  const [filteredVillas, setFilteredVillas] = useState([]); // State untuk villa yang sudah difilter
  const [currentFilterStatus, setCurrentFilterStatus] = useState("Pending"); // Default filter status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();

  // Fungsi untuk mengambil semua villa dari backend
  const fetchAllVillas = async () => {
    if (!token || !user || user.role !== "admin") {
      setLoading(false);
      setError(
        "Not authenticated or authorized as admin. Please login with an admin account."
      );
      return;
    }
    setLoading(true); // Set loading true sebelum fetch
    setError(null); // Hapus error sebelumnya
    try {
      const response = await fetch(`${BASE_URL}/api/villas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setVillas(data); // Simpan semua data villa
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

  useEffect(() => {
    fetchAllVillas(); // Panggil saat komponen dimuat atau token/user berubah
  }, [token, user]);

  // Efek samping untuk memfilter villa setiap kali 'villas' atau 'currentFilterStatus' berubah
  useEffect(() => {
    if (villas.length > 0) {
      if (currentFilterStatus === "All") {
        setFilteredVillas(villas);
      } else {
        setFilteredVillas(
          villas.filter((villa) => villa.status === currentFilterStatus)
        );
      }
    } else {
      setFilteredVillas([]); // Kosongkan jika tidak ada villa
    }
  }, [villas, currentFilterStatus]);

  const updateVillaStatus = async (villaId, status) => {
    setLoading(true); // Mulai loading saat aksi dilakukan
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
        // Setelah update, panggil ulang fetchAllVillas untuk mendapatkan data terbaru
        // Ini akan memicu filter lagi dan memperbarui tampilan tabel
        fetchAllVillas();
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

  const handleApprove = (villaId) => updateVillaStatus(villaId, "Approved");
  const handleReject = (villaId) => updateVillaStatus(villaId, "Rejected");

  // Tampilkan pesan loading atau error utama untuk halaman
  if (loading) return <p className="text-center mt-5">Loading villas...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  return (
    <div>
      <NavbarProfile />
      <div className="admin-container">
        <div className="admin-sidebar">
          <ul>
            <li
              className={activeMenu === "manage" ? "active" : ""}
              onClick={() => setActiveMenu("manage")}
              style={{ cursor: "pointer" }}
            >
              MANAGE
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
          {activeMenu === "manage" && (
            <>
              {/* Filter Buttons */}
              <div className="filter-buttons mb-3">
                <button
                  className={`btn ${
                    currentFilterStatus === "Pending"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  } me-2`}
                  onClick={() => setCurrentFilterStatus("Pending")}
                >
                  Pending
                </button>
                <button
                  className={`btn ${
                    currentFilterStatus === "Approved"
                      ? "btn-success"
                      : "btn-outline-success"
                  } me-2`}
                  onClick={() => setCurrentFilterStatus("Approved")}
                >
                  Approved
                </button>
                <button
                  className={`btn ${
                    currentFilterStatus === "Rejected"
                      ? "btn-danger"
                      : "btn-outline-danger"
                  } me-2`}
                  onClick={() => setCurrentFilterStatus("Rejected")}
                >
                  Rejected
                </button>
                <button
                  className={`btn ${
                    currentFilterStatus === "All"
                      ? "btn-info"
                      : "btn-outline-info"
                  }`}
                  onClick={() => setCurrentFilterStatus("All")}
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
                              onClick={() => handleApprove(villa.id)}
                              disabled={loading || villa.status === "Approved"}
                            >
                              Approve
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => handleReject(villa.id)}
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
                          {currentFilterStatus === "All"
                            ? ""
                            : `with status "${currentFilterStatus}"`}{" "}
                          to manage.
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
