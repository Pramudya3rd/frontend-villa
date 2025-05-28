// frontend-sewa-villa/src/components/Detail.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Detail = () => {
  const { id } = useParams(); // Mengambil ID langsung di sini
  const navigate = useNavigate();
  const [villa, setVilla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMainImage, setCurrentMainImage] = useState("");

  useEffect(() => {
    const fetchVillaDetails = async () => {
      console.log("[DEBUG Detail] Fetching villa details for ID:", id);

      if (!id) {
        setError("Villa ID is missing in URL.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/villas/${id}`);
        console.log("[DEBUG Detail] Fetch response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("[DEBUG Detail] Fetched villa data:", data);

          // --- Perbaikan: Pastikan features selalu menjadi array ---
          let processedFeatures = [];
          if (Array.isArray(data.features)) {
            processedFeatures = data.features;
          } else if (typeof data.features === "string") {
            try {
              const parsed = JSON.parse(data.features);
              if (Array.isArray(parsed)) {
                processedFeatures = parsed;
              } else {
                processedFeatures = data.features
                  .split(",")
                  .map((f) => f.trim());
              }
            } catch (e) {
              processedFeatures = data.features.split(",").map((f) => f.trim());
            }
          }
          // --- Akhir perbaikan features ---

          // --- Perbaikan: Pastikan images selalu menjadi array ---
          let processedImages = [];
          if (Array.isArray(data.images)) {
            processedImages = data.images;
          } else if (typeof data.images === "string") {
            try {
              const parsed = JSON.parse(data.images);
              if (Array.isArray(parsed)) {
                processedImages = parsed;
              }
            } catch (e) {
              // Biarkan kosong jika tidak bisa di-parse sebagai array JSON
            }
          }
          // --- Akhir perbaikan images ---

          setVilla({
            ...data,
            features: processedFeatures,
            images: processedImages,
          });
          setCurrentMainImage(getImageUrl(data.mainImage));
        } else {
          const errorData = await response.json();
          console.error(
            "[DEBUG Detail] Failed to fetch villa details:",
            errorData
          );
          setError(errorData.message || "Failed to fetch villa details.");
        }
      } catch (err) {
        console.error(
          "Error fetching villa details (network/parse error):",
          err
        );
        setError("Network error or server unavailable when fetching villa.");
      } finally {
        setLoading(false);
      }
    };
    fetchVillaDetails();
  }, [id]);

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

  const handleThumbnailClick = (imagePath) => {
    setCurrentMainImage(getImageUrl(imagePath));
  };

  if (loading)
    return <p className="text-center mt-5">Loading villa details...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;
  if (!villa) return <p className="text-center mt-5">Villa not found.</p>;

  // Perbaikan: Penanganan yang lebih aman untuk navigasi Booking
  const handleBooking = () => {
    console.log("Attempting to navigate to booking. Villa object:", villa);
    console.log(
      "Villa ID for booking:",
      villa ? villa.id : "ID is undefined/null"
    );

    // Pastikan villa dan villa.id tersedia sebelum navigasi
    if (villa && villa.id) {
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
      // Tampilkan pesan error kepada pengguna jika ID tidak ditemukan
      alert(
        "Cannot proceed to booking: Villa details or ID are missing. Please try again later."
      );
      console.error("Booking failed: Villa object or ID is invalid.", villa);
    }
  };

  // Ambil hingga 4 gambar (termasuk gambar utama) untuk thumbnail
  const allAvailableImages = [];
  if (villa.mainImage) {
    allAvailableImages.push(villa.mainImage);
  }
  if (Array.isArray(villa.images)) {
    villa.images.forEach((img) => {
      if (img && img !== villa.mainImage) {
        // Pastikan img tidak null/undefined dan bukan mainImage
        allAvailableImages.push(img);
      }
    });
  }
  const displayedThumbnails = allAvailableImages.slice(0, 4); // Batasi hingga 4 thumbnail

  return (
    <div className="container py-5">
      <div className="row g-5">
        {/* Main image and thumbnails */}
        <div className="col-md-6">
          <img
            src={currentMainImage}
            alt={villa.name}
            className="img-fluid rounded-4 mb-3"
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
          />
          <div className="row g-3">
            {displayedThumbnails.map((img, i) => (
              <div className="col-4" key={i}>
                <img
                  src={getImageUrl(img)}
                  alt={`thumbnail-${i}`}
                  className="img-fluid img-thumbnail rounded-4"
                  style={{
                    height: "80px",
                    objectFit: "cover",
                    width: "100%",
                    cursor: "pointer",
                    border:
                      currentMainImage === getImageUrl(img)
                        ? "2px solid #5a7684"
                        : "none",
                  }}
                  onClick={() => handleThumbnailClick(img)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Villa Detail Info */}
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
            {Array.isArray(villa.features) &&
              villa.features
                .filter((feature) => feature.trim() !== "")
                .map((feature, i) => (
                  <div className="col mb-2" key={i}>
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
