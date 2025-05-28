// frontend-sewa-villa/src/pages/DetailsVilla.jsx
import React from "react";
import NavbarProfile from "../components/NavbarProfile";
import Detail from "../components/Detail";
import { useParams } from "react-router-dom"; // Pastikan ini diimpor

export default function DetailsVilla() {
  const { id } = useParams(); // Dapatkan ID villa dari URL parameter

  return (
    <>
      <NavbarProfile />
      <Detail />{" "}
      {/* Detail component akan mengambil ID dari useParams-nya sendiri */}
    </>
  );
}
