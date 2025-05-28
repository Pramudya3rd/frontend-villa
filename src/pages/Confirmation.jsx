// frontend-sewa-villa/src/pages/Confirmation.jsx
import React from "react";
import NavbarProfile from "../components/NavbarProfile"; //
import StepProgress from "../components/StepProgress"; //
import ConfirmationPage from "../components/Confirmation"; //
import { useParams } from "react-router-dom"; // Import useParams

export default function Confirmation() {
  const { bookingId } = useParams(); // Get bookingId from URL
  return (
    <>
      <NavbarProfile />
      <StepProgress currentStep={3} /> {/* Confirmation is step 3 */}
      <ConfirmationPage bookingId={bookingId} />
    </>
  );
}
