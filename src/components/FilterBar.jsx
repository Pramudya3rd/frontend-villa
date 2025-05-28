import React from "react";
import { FaSearch } from "react-icons/fa";

const FilterBar = ({ onFilterChange, currentFilters }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleLocationChange = (e) => {
    onFilterChange({
      location: e.target.value === "Location" ? "" : e.target.value,
    });
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    let min = "";
    let max = "";
    if (value === "Lowest to Highest") {
      min = 0;
      max = "";
    } else if (value === "Highest to Lowest") {
      min = "";
      max = 100000000; // Contoh nilai maksimum yang tinggi
    }
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  const handleRatingChange = (e) => {
    // Logika untuk rating, jika backend mendukung filter rating
    // Contoh: onFilterChange({ minRating: e.target.value === 'Highest First' ? 4 : '' });
  };

  return (
    <div className="d-flex flex-wrap gap-3 justify-content-center my-4">
      {/* Search Input */}
      <div
        className="input-group rounded-pill border px-3"
        style={{ maxWidth: "250px" }}
      >
        <input
          type="text"
          className="form-control border-0"
          placeholder="Search villa name"
          style={{ borderRadius: "30px" }}
          value={currentFilters.search}
          onChange={handleSearchChange}
        />
        <span className="input-group-text bg-white border-0">
          <FaSearch />
        </span>
      </div>

      {/* Location Filter */}
      <select
        className="form-select rounded-pill border px-3"
        style={{ maxWidth: "150px" }}
        onChange={handleLocationChange}
        value={currentFilters.location}
      >
        <option value="">Location</option>
        <option value="Ubud">Ubud</option>
        <option value="Canggu">Canggu</option>
        <option value="Seminyak">Seminyak</option>
        {/* Tambahkan lokasi lain sesuai data di backend */}
      </select>

      {/* Price Filter */}
      <select
        className="form-select rounded-pill border px-3"
        style={{ maxWidth: "150px" }}
        onChange={handlePriceChange}
      >
        <option value="">Price</option>
        <option value="Lowest to Highest">Lowest to Highest</option>
        <option value="Highest to Lowest">Highest to Lowest</option>
      </select>

      {/* Rating Filter (sesuaikan dengan kemampuan backend) */}
      <select
        className="form-select rounded-pill border px-3"
        style={{ maxWidth: "150px" }}
        onChange={handleRatingChange}
      >
        <option value="">Rating</option>
        <option value="Highest First">Highest First</option>
        {/* Opsi rating lain */}
      </select>
    </div>
  );
};

export default FilterBar;
