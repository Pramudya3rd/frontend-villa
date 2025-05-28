import React, { useState } from "react";
import NavbarProfile from "../components/NavbarProfile";
import FilterBar from "../components/FilterBar";
import ListVilla from "../components/ListVilla";

export default function OurVilla() {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    maxRating: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <>
      <NavbarProfile />
      <FilterBar onFilterChange={handleFilterChange} currentFilters={filters} />
      <ListVilla filters={filters} />
    </>
  );
}
