// frontend-sewa-villa/src/pages/Payment.jsx
import React from "react";
import NavbarProfile from "../components/NavbarProfile"; //
import StepProgress from "../components/StepProgress"; //
import PaymentPage from "../components/PaymentPage"; //
import { useParams } from "react-router-dom"; // Import useParams

export default function Payment() {
  const { bookingId } = useParams(); // Get bookingId from URL

  return (
    <>
      <NavbarProfile />
      <StepProgress currentStep={2} />
      <PaymentPage bookingId={bookingId} />
    </>
  );
}
