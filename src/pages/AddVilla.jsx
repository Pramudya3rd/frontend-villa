// frontend-sewa-villa/src/pages/AddVilla.jsx
import React, { useState } from "react";
import NavbarProfile from "../components/NavbarProfile"; //
import "../styles/add-villa.css"; //
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddVilla = () => {
  const { token } = useAuth(); // Get token from context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    villaName: "",
    address: "",
    description: "",
    capacity: "",
    price: "",
    mainImage: null, // File object for upload
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [roomFeatures, setRoomFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "mainImage" && files.length > 0) {
      // Changed name from 'image' to 'mainImage'
      const file = files[0];
      setFormData({ ...formData, mainImage: file });
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFeatureChange = (e) => {
    setNewFeature(e.target.value);
  };

  const addFeature = () => {
    if (newFeature.trim() !== "" && !roomFeatures.includes(newFeature.trim())) {
      setRoomFeatures([...roomFeatures, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (feature) => {
    setRoomFeatures(roomFeatures.filter((f) => f !== feature));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError("You must be logged in to add a villa.");
      setLoading(false);
      return;
    }

    let mainImageUrl = "";
    if (formData.mainImage) {
      try {
        const formDataImage = new FormData();
        formDataImage.append("image", formData.mainImage); // Key 'image' sesuai backend multer

        const uploadResponse = await fetch(`${BASE_URL}/api/upload`, {
          method: "POST",
          body: formDataImage,
        });

        const uploadData = await uploadResponse.json();
        if (uploadResponse.ok) {
          mainImageUrl = uploadData.imageUrl;
        } else {
          setError(uploadData.message || "Failed to upload image.");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Image upload error:", err);
        setError("Network error during image upload.");
        setLoading(false);
        return;
      }
    } else {
      setError("Main image is required.");
      setLoading(false);
      return;
    }

    const completeData = {
      villaName: formData.villaName,
      address: formData.address, // Mapped to 'location' in backend
      description: formData.description,
      capacity: parseInt(formData.capacity), // Mapped to 'guests' in backend
      price: parseFloat(formData.price),
      mainImage: mainImageUrl,
      images: [], // Anda bisa menambahkan logika untuk multiple images jika ada
      features: roomFeatures,
      // Tambahkan fitur villa lainnya jika ada di form, contoh: beds, bathrooms, area, pool, floor
      beds: 0, // Placeholder jika tidak ada input di form
      bathrooms: 0, // Placeholder
      area: "", // Placeholder
      pool: 0, // Placeholder
      guests: parseInt(formData.capacity), // Pastikan konsisten
      floor: 0, // Placeholder
    };

    try {
      const response = await fetch(`${BASE_URL}/api/villas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(completeData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Villa data uploaded successfully!");
        console.log("Villa added:", data);
        // Clear form or redirect
        setFormData({
          villaName: "",
          address: "",
          description: "",
          capacity: "",
          price: "",
          mainImage: null,
        });
        setPreviewImage(null);
        setRoomFeatures([]);
        setNewFeature("");
        navigate("/owner"); // Redirect to owner dashboard
      } else {
        setError(data.message || "Failed to upload villa data.");
      }
    } catch (err) {
      console.error("Villa upload error:", err);
      setError("Network error or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarProfile />
      <div className="add-villa-container">
        <form onSubmit={handleSubmit} className="add-villa-form">
          <div className="upload-section">
            <label>UPLOAD IMAGES</label>
            <div className="image-placeholder">
              {previewImage ? (
                <img src={previewImage} alt="Villa Preview" />
              ) : (
                <span>No image selected</span>
              )}
            </div>
            <input
              type="file"
              name="mainImage"
              onChange={handleChange}
              accept="image/*"
            />{" "}
            {/* Changed name */}
          </div>

          <div className="details-section">
            <label>FILL YOUR DETAILS</label>

            <input
              type="text"
              name="villaName"
              placeholder="Villa Name"
              value={formData.villaName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <div className="inline-inputs">
              <input
                type="number"
                name="capacity"
                placeholder="Capacity (guests)"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price per night"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Room Features Section */}
            <label>ROOM FEATURES</label>
            <div className="inline-inputs">
              <input
                type="text"
                placeholder="Add a feature (e.g., TV, AC)"
                value={newFeature}
                onChange={handleFeatureChange}
                className="feature-input"
              />
              <button
                type="button"
                onClick={addFeature}
                className="add-feature-btn"
              >
                Add
              </button>
            </div>
            <ul className="features-list">
              {roomFeatures.map((feature, index) => (
                <li key={index}>
                  {feature}
                  <button type="button" onClick={() => removeFeature(feature)}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            {error && <p className="text-danger">{error}</p>}
            <div className="inline-inputs">
              <button
                type="submit"
                className="upload-btn full-width-btn"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddVilla;
