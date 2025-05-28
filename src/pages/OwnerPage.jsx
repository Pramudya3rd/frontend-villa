import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarProfile from "../components/NavbarProfile";
import "../styles/owner.css";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { useAuth } from "../context/AuthContext"; // Pastikan ini diimpor

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Pastikan variabel ini ada di .env frontend

const OwnerDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("manage");
  const [villaList, setVillaList] = useState([]); // Gunakan state untuk villaList
  const [loading, setLoading] = useState(true); // State loading
  const [error, setError] = useState(null); // State error
  const navigate = useNavigate();
  const { token, user } = useAuth(); // Dapatkan token dan user dari AuthContext

  useEffect(() => {
    const fetchOwnerVillas = async () => {
      if (!token || !user) {
        setLoading(false);
        setError("Not authenticated or authorized.");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/villas/owner/my-villas`, {
          // Ambil villa milik owner
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setVillaList(data); // Set data villa ke state
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch villas.");
        }
      } catch (err) {
        console.error("Error fetching owner villas:", err);
        setError("Network error or server unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerVillas();
  }, [token, user]); // Panggil ulang jika token atau user berubah

  const handleAddVilla = () => {
    navigate("/add-villa");
  };

  const handleDeleteVilla = async (villaId) => {
    if (!window.confirm("Are you sure you want to delete this villa?")) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/villas/${villaId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        alert("Villa deleted successfully.");
        setVillaList((prev) => prev.filter((villa) => villa.id !== villaId)); // Perbarui UI
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete villa.");
      }
    } catch (err) {
      console.error("Delete villa error:", err);
      alert("Network error or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  // Tampilkan pesan loading atau error
  if (loading) return <p className="text-center mt-5">Loading dashboard...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  return (
    <div className="owner-dashboard">
      <NavbarProfile role="owner" />
      <div className="owner-container">
        <aside className="owner-sidebar">
          <ul>
            <li
              className={activeMenu === "manage" ? "active" : ""}
              onClick={() => setActiveMenu("manage")}
            >
              MANAGE
            </li>
            <li
              className={activeMenu === "profile" ? "active" : ""}
              onClick={() => setActiveMenu("profile")}
            >
              PROFIL
            </li>
          </ul>
        </aside>

        <main className="owner-content">
          {activeMenu === "manage" && (
            <>
              <button className="add-villa-btn" onClick={handleAddVilla}>
                Add Villa
              </button>

              <div className="villa-table">
                <table>
                  <thead>
                    <tr>
                      <th>Villa Name</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {villaList.length > 0 ? (
                      villaList.map((villa) => (
                        <tr key={villa.id}>
                          <td>{villa.name}</td>
                          <td>{villa.location}</td>{" "}
                          {/* Tampilkan location sebagai address */}
                          <td>{villa.status}</td>
                          <td className="action-icons">
                            <FiEye
                              title="View"
                              onClick={() => {
                                console.log("Viewing villa ID:", villa.id); // Debugging: pastikan ID villa tercetak di konsol browser
                                navigate(`/villa-detail/${villa.id}`); // Navigasi ke detail villa dengan ID
                              }}
                            />
                            <FiEdit
                              title="Edit"
                              onClick={() =>
                                alert("Edit functionality coming soon!")
                              }
                            />{" "}
                            {/* Implement EditVilla page */}
                            <FiTrash2
                              title="Delete"
                              onClick={() => handleDeleteVilla(villa.id)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No villas added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeMenu === "profile" && (
            <div className="profile-section">
              <h2>Owner Profile</h2>
              <p>
                Isi detail profil di sini. Anda bisa mengambil data profil dari
                AuthContext.
              </p>
              {user && (
                <div>
                  <p>Name: {user.name}</p>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phone}</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
