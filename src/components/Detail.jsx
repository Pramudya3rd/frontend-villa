// frontend-sewa-villa/src/components/Detail.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaTv,
  FaWifi,
  FaSnowflake,
  FaThermometerHalf,
  FaBath,
  FaUserFriends,
  FaRulerCombined,
  FaBed,
  FaSwimmer,
  FaLayerGroup,
} from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Pastikan variabel ini ada di .env frontend

const Detail = ({ villaId }) => {
  // Menerima villaId sebagai prop
  const navigate = useNavigate();
  const [villa, setVilla] = useState(null); // State untuk data villa
  const [loading, setLoading] = useState(true); // State loading
  const [error, setError] = useState(null); // State error

  useEffect(() => {
    const fetchVillaDetails = async () => {
      // DEBUGGING: Log villaId yang diterima
      console.log("[DEBUG Detail] Fetching villa details for ID:", villaId);

      if (!villaId) {
        // Jika villaId tidak ada, set error dan berhenti
        setError("Villa ID is missing in URL.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/villas/${villaId}`); // Ambil detail villa dari backend
        // DEBUGGING: Log respons status
        console.log("[DEBUG Detail] Fetch response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          // DEBUGGING: Log data yang diterima
          console.log("[DEBUG Detail] Fetched villa data:", data);
          setVilla(data); // Set data villa ke state
        } else {
          const errorData = await response.json();
          console.error(
            "[DEBUG Detail] Failed to fetch villa details:",
            errorData
          );
          setError(errorData.message || "Failed to fetch villa details."); // Set pesan error dari backend
        }
      } catch (err) {
        console.error(
          "Error fetching villa details (network/parse error):",
          err
        );
        setError("Network error or server unavailable when fetching villa."); // Tangani error jaringan
      } finally {
        setLoading(false); // Selesai loading
      }
    };
    fetchVillaDetails();
  }, [villaId]); // Panggil ulang useEffect jika villaId berubah

  // Tampilkan pesan loading, error, atau villa not found
  if (loading)
    return <p className="text-center mt-5">Loading villa details...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;
  if (!villa) return <p className="text-center mt-5">Villa not found.</p>; // <-- Pesan ini yang muncul

  // Pastikan URL gambar dari backend benar, mungkin perlu prefix BASE_URL jika gambar disimpan secara lokal
  const mainImageUrl =
    villa.mainImage && villa.mainImage.startsWith("/")
      ? BASE_URL + villa.mainImage
      : villa.mainImage;
  const roomImages = (villa.images || []).map((img) =>
    img.startsWith("/") ? BASE_URL + img : img
  );

  const handleBooking = () => {
    if (villa) {
      // Data villa sudah ada, lanjutkan ke booking
      navigate(`/booking/${villa.id}`, {
        state: {
          title: villa.name,
          price: villa.price,
          mainImage: villa.mainImage,
          features: villa.features,
          beds: villa.beds,
          bathrooms: villa.bathrooms,
          area: villa.area,
          pool: villa.pool,
          guests: villa.guests,
          floor: villa.floor,
        },
      });
    } else {
      // Ini seharusnya tidak terjadi jika 'if (!villa) return ...' sudah di atas
      alert("Villa details are not fully loaded. Please try again.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-5">
        {/* ... (render detail villa seperti sebelumnya) ... */}
        {/* Gambar utama dan thumbnail */}
        <div className="col-md-6">
          <img
            src={mainImageUrl}
            alt={villa.name}
            className="img-fluid rounded-4 mb-3"
          />
          <div className="row g-3">
            {roomImages.slice(0, 3).map((img, i) => (
              <div className="col-4" key={i}>
                <img
                  src={img}
                  alt={`room-${i}`}
                  className="img-fluid img-thumbnail rounded-4"
                  style={{ height: "80px", objectFit: "cover", width: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info Detail Villa */}
        <div className="col-md-6">
          <h3 className="fw-bold">{villa.name}</h3>
          <p className="mb-2">
            <span className="text-warning">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </span>
            <span className="ms-2">
              4.9 <span className="text-muted">(20 Reviews)</span>
            </span>
          </p>
          <h5 className="fw-bold text-dark mb-3">
            Rp. {parseFloat(villa.price).toLocaleString("id-ID")}{" "}
            <span className="fw-normal text-muted">/ night</span>
          </h5>
          <p className="text-muted">{villa.description}</p>

          <h6 className="fw-bold mt-4 mb-2">Room Features</h6>
          <div className="row row-cols-2 mb-3 text-muted">
            {villa.features &&
              villa.features.map((feature, i) => (
                <div className="col mb-2" key={i}>
                  {feature === "TV" && <FaTv className="me-2" />}
                  {feature === "Free Wifi" && <FaWifi className="me-2" />}
                  {feature === "Air Conditioner" && (
                    <FaSnowflake className="me-2" />
                  )}
                  {feature === "Heater" && (
                    <FaThermometerHalf className="me-2" />
                  )}
                  {feature === "Private Bathroom" && (
                    <FaBath className="me-2" />
                  )}
                  {feature}
                </div>
              ))}
            {villa.guests && (
              <div className="col mb-2">
                <FaUserFriends className="me-2" />
                Max Guests: <strong>{villa.guests}</strong>
              </div>
            )}
            {villa.area && (
              <div className="col mb-2">
                <FaRulerCombined className="me-2" />
                Size: <strong>{villa.area}</strong>
              </div>
            )}
            {villa.beds && (
              <div className="col mb-2">
                <FaBed className="me-2" />
                Beds: <strong>{villa.beds}</strong>
              </div>
            )}
            {villa.bathrooms && (
              <div className="col mb-2">
                <FaBath className="me-2" />
                Bathrooms: <strong>{villa.bathrooms}</strong>
              </div>
            )}
            {villa.pool && (
              <div className="col mb-2">
                <FaSwimmer className="me-2" />
                Swimming Pool: <strong>{villa.pool}</strong>
              </div>
            )}
            {villa.floor && (
              <div className="col mb-2">
                <FaLayerGroup className="me-2" />
                Floor: <strong>{villa.floor}</strong>
              </div>
            )}
          </div>

          <h6 className="fw-bold mt-4 mb-2">Children and Extra Beds</h6>
          <p className="text-muted mb-4">
            Children are welcome to stay. Extra beds are available upon request
            and may incur additional charges.
          </p>

          <button
            className="btn rounded-pill text-white w-100 py-2"
            style={{ backgroundColor: "#5a7684" }}
            onClick={handleBooking}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Detail;
