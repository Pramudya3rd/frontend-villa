import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VillaCard from "./VillaCard";
import "../styles/VillaCard.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Pastikan variabel ini ada di .env frontend

const ListVilla = ({ filters = {} }) => {
  const navigate = useNavigate();
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVillas = async () => {
      setLoading(true);
      setError(null);
      const queryString = new URLSearchParams(filters).toString();
      try {
        const response = await fetch(`${BASE_URL}/api/villas?${queryString}`);
        if (response.ok) {
          const data = await response.json();
          // Filter hanya villa yang berstatus 'Approved' untuk ditampilkan di halaman Our Villa
          const approvedVillas = data.filter(
            (villa) => villa.status === "Approved"
          );
          setVillas(approvedVillas);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch villas.");
        }
      } catch (err) {
        console.error("Error fetching villas:", err);
        setError("Network error or server unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchVillas();
  }, [filters]);

  if (loading) return <p className="text-center mt-5">Loading villas...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;
  if (villas.length === 0)
    return (
      <p className="text-center mt-5">
        No approved villas found matching your criteria.
      </p>
    );

  return (
    <section className="container pb-5">
      <h2 className="section-title">Our Villa</h2>
      <p className="section-subtitle">Happy Holiday, Enjoy Your Staycation</p>
      <div className="row g-4 justify-content-center">
        {villas.map((villa) => {
          // DEBUGGING: Tambahkan console.log di sini
          console.log(
            "[DEBUG ListVilla] Rendering VillaCard for villa ID:",
            villa.id,
            "and name:",
            villa.name
          );

          return (
            <VillaCard
              key={villa.id}
              title={villa.name}
              location={villa.location}
              price={`Rp. ${parseFloat(villa.price).toLocaleString(
                "id-ID"
              )}/Night`}
              image={
                villa.mainImage.startsWith("/")
                  ? BASE_URL + villa.mainImage
                  : villa.mainImage
              }
              // PERBAIKAN DI SINI: Teruskan villaId sebagai prop ke VillaCard
              villaId={villa.id} // <--- Tambahkan baris ini
              // Hapus onBookNow jika tidak lagi dibutuhkan di VillaCard, karena handleBookNow sekarang di dalam VillaCard
              // Jika Anda ingin mempertahankan onBookNow untuk fleksibilitas, Anda bisa memodifikasi VillaCard
              // Namun, untuk saat ini, dengan VillaCard yang Anda berikan, meneruskan villaId sudah cukup.
            />
          );
        })}
      </div>
    </section>
  );
};

export default ListVilla;
