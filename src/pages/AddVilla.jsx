// frontend-villa/src/pages/AddVilla.jsx
import React, { useState } from "react";
import NavbarProfile from "../components/NavbarProfile";
import "../styles/add-villa.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddVilla = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    villaName: "",
    address: "",
    description: "",
    capacity: "",
    price: "",
    size: "",
    bedType: "",
    mainImage: null,
    additionalImages: [],
  });

  const [previewMainImage, setPreviewMainImage] = useState(null);
  const [previewAdditionalImages, setPreviewAdditionalImages] = useState([]);
  const [roomFeatures, setRoomFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "mainImage" && files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, mainImage: file });
      setPreviewMainImage(URL.createObjectURL(file));
    } else if (name === "additionalImages") {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...newFiles],
      }));
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewAdditionalImages((prev) => [...prev, ...newPreviews]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const removeAdditionalImage = (index) => {
    setFormData((prev) => {
      const updatedImages = [...prev.additionalImages];
      updatedImages.splice(index, 1);
      return { ...prev, additionalImages: updatedImages };
    });
    setPreviewAdditionalImages((prev) => {
      const updatedPreviews = [...prev];
      URL.revokeObjectURL(updatedPreviews[index]);
      updatedPreviews.splice(index, 1);
      return updatedPreviews;
    });
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

  const uploadImage = async (file) => {
    const formDataImage = new FormData();
    formDataImage.append("image", file); // Key 'image' sesuai backend multer

    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST",
      body: formDataImage,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Failed to upload image: ${file.name}`);
    }
    return data.imageUrl;
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

    // STEP 1: Validasi data formulir terlebih dahulu
    if (
      !formData.villaName.trim() ||
      !formData.address.trim() ||
      !formData.description.trim() ||
      !formData.capacity ||
      !formData.price ||
      !formData.size.trim() ||
      !formData.bedType.trim() ||
      !formData.mainImage
    ) {
      setError(
        "All fields (Villa Name, Address, Description, Capacity, Price, Size, Bed Type, and Main Image) are required."
      );
      setLoading(false);
      return;
    }

    let mainImageUrl = "";
    const additionalImageUrls = [];

    try {
      // STEP 2: Upload Main Image
      mainImageUrl = await uploadImage(formData.mainImage);

      // STEP 3: Upload Additional Images (jika ada)
      for (const file of formData.additionalImages) {
        try {
          const url = await uploadImage(file);
          additionalImageUrls.push(url);
        } catch (uploadErr) {
          console.warn(
            `Warning: Could not upload additional image ${file.name}. Error: ${uploadErr.message}`
          );
          // Lanjutkan proses meskipun ada gambar tambahan yang gagal diupload
        }
      }

      // STEP 4: Kirim data villa ke database (setelah semua gambar berhasil diupload atau ditangani)
      const completeData = {
        name: formData.villaName,
        location: formData.address,
        description: formData.description,
        guests: parseInt(formData.capacity),
        price: parseFloat(formData.price),
        mainImage: mainImageUrl,
        images: additionalImageUrls,
        features: roomFeatures,
        area: formData.size,
        beds: parseInt(formData.bedType),
        bathrooms: 0, // Default value, modify if you add input for this
        pool: 0, // Default value, modify if you add input for this
        floor: 0, // Default value, modify if you add input for this
      };

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
        // Clear form and previews after successful upload AND database save
        setFormData({
          villaName: "",
          address: "",
          description: "",
          capacity: "",
          price: "",
          size: "",
          bedType: "",
          mainImage: null,
          additionalImages: [],
        });
        setPreviewMainImage(null);
        setPreviewAdditionalImages([]);
        setRoomFeatures([]);
        setNewFeature("");
        navigate("/owner");
      } else {
        setError(data.message || "Failed to upload villa data.");
      }
    } catch (err) {
      console.error("Villa submission error:", err);
      setError(
        err.message || "An unexpected error occurred during villa submission."
      );
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

            {/* Main Image Upload */}
            <div className="mb-3">
              <label htmlFor="mainImage" className="form-label">
                Main Image
              </label>
              <div className="image-placeholder">
                {previewMainImage ? (
                  <img src={previewMainImage} alt="Main Villa Preview" />
                ) : (
                  <span>No main image selected</span>
                )}
              </div>
              <input
                type="file"
                name="mainImage"
                id="mainImage"
                onChange={handleChange}
                accept="image/*"
                className="form-control"
                required
              />
            </div>

            {/* Additional Images Upload */}
            <div className="mb-3">
              <label htmlFor="additionalImages" className="form-label">
                Additional Images (Optional)
              </label>
              <input
                type="file"
                name="additionalImages"
                id="additionalImages"
                onChange={handleChange}
                accept="image/*"
                multiple
                className="form-control"
              />
              <div className="d-flex flex-wrap mt-2 gap-2">
                {previewAdditionalImages.map((preview, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      width: "100px",
                      height: "100px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={preview}
                      alt={`Additional Preview ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        backgroundColor: "rgba(255,0,0,0.7)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
            {/* Input for Size */}
            <input
              type="text"
              name="size"
              placeholder="Size (e.g., 24m²)"
              value={formData.size}
              onChange={handleChange}
              required
            />
            {/* Input for Bed Type */}
            <input
              type="text"
              name="bedType"
              placeholder="Bed Type (e.g., 1 King Bed)"
              value={formData.bedType}
              onChange={handleChange}
              required
            />

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
