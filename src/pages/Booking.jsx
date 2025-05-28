// frontend-sewa-villa/src/pages/Booking.jsx
import React from "react";
import NavbarProfile from "../components/NavbarProfile";
import StepProgress from "../components/StepProgress";
import VillaBookingCard from "../components/VillaBookingCard";
import { useParams } from "react-router-dom"; // Pastikan ini diimpor

export default function Booking() {
  const { villaId } = useParams(); // Dapatkan villaId dari URL

  return (
    <>
      <NavbarProfile />
      <StepProgress currentStep={1} />
      <VillaBookingCard villaId={villaId} />{" "}
      {/* Lewatkan villaId ke komponen */}
    </>
  );
}
