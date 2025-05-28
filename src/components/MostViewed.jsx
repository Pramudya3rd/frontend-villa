// frontend-sewa-villa/src/components/MostViewed.jsx
import React, { useState, useEffect } from "react";
import VillaCard from "./VillaCard";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Pastikan variabel ini ada di .env frontend

const MostViewed = () => {
  const navigate = useNavigate(); // Inisialisasi useNavigate
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMostViewedVillas = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mengambil 3 villa teratas (atau sesuai limit dari backend)
        const response = await fetch(`${BASE_URL}/api/villas?limit=3`);
        if (response.ok) {
          const data = await response.json();
          // PERBAIKAN: Filter status "Approved" di frontend untuk tampilan Most Viewed
          const approvedVillas = data.filter(
            (villa) => villa.status === "Approved"
          );
          setVillas(approvedVillas); // Set data villa yang sudah difilter
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch most viewed villas.");
        }
      } catch (err) {
        console.error("Error fetching most viewed villas:", err);
        setError("Network error or server unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchMostViewedVillas();
  }, []);

  if (loading)
    return <p className="text-center">Loading most viewed villas...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;
  if (villas.length === 0)
    return <p className="text-center">No most viewed villas found.</p>;

  return (
    <section className="container pb-5">
      <h2 className="section-title">MOST VIEWED</h2>
      <p className="section-subtitle">
        Discover our top-rated villas by our guests
      </p>
      <div className="row g-4 justify-content-center">
        {villas.map((villa) => (
          <VillaCard
            key={villa.id}
            title={villa.name}
            location={villa.location}
            price={`Rp. ${parseFloat(villa.price).toLocaleString(
              "id-ID"
            )} / Night`}
            image={
              // Pastikan URL gambar dari backend benar
              villa.mainImage &&
              (villa.mainImage.startsWith("/")
                ? BASE_URL + villa.mainImage
                : villa.mainImage.startsWith("http")
                ? villa.mainImage
                : BASE_URL + "/" + villa.mainImage)
            }
            villaId={villa.id} // ID villa diteruskan ke VillaCard
          />
        ))}
      </div>
    </section>
  );
};

export default MostViewed;
