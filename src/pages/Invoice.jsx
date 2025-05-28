// frontend-sewa-villa/src/pages/Invoice.jsx
import React from "react";
import NavbarProfile from "../components/NavbarProfile"; //
import InvoicePage from "../components/InvoicePage"; //
import StepProgress from "../components/StepProgress"; //
import { useParams } from "react-router-dom"; // Import useParams

export default function Invoice() {
  const { bookingId } = useParams(); // Get bookingId from URL
  return (
    <>
      <NavbarProfile />
      <StepProgress currentStep={3} /> {/* Invoice is step 3 */}
      <InvoicePage bookingId={bookingId} />
    </>
  );
}
