// frontend-sewa-villa/src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import HomePage from "../pages/HomePage";
import OurVilla from "../pages/OurVilla";
import AboutPage from "../pages/AboutPage";
import FaqPage from "../pages/FaqPage";
import ContactPage from "../pages/ContactPage";
import DetailsVilla from "../pages/DetailsVilla";
import Payment from "../pages/Payment";
import Confirmation from "../pages/Confirmation";
import Invoice from "../pages/Invoice";
import Login from "../pages/Login";
import Booking from "../pages/Booking";
import Register from "../pages/Register";
import ForgotPasswordPage from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import PasswordUpdated from "../pages/PasswordUpdated";
import ProfilePage from "../pages/ProfilePage";
import AdminPage from "../pages/AdminPage";
import OwnerDashboard from "../pages/OwnerPage";
import AddVilla from "../pages/AddVilla";
import NotFoundPage from "../pages/NotFoundPage";
import ForbiddenPage from "../pages/ForbiddenPage";
import ProtectedRoute from "./ProtectedRoute"; // Pastikan ini diimpor

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rute Publik (akses tanpa login) */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/password-updated" element={<PasswordUpdated />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />

      {/* Rute Publik yang mungkin menunjukkan konten berbeda jika login */}
      {/* Rute ini akan tetap publik, tapi jika detail villa dipindahkan ke protected, ini akan memengaruhi jalur ke detail */}
      <Route path="/our-villa" element={<OurVilla />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Rute yang Dilindungi untuk pengguna yang sudah login */}
      {/* Ini akan melindungi semua rute di dalamnya, termasuk detail villa, booking, pembayaran, dll. */}
      <Route element={<ProtectedRoute />}>
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* NEW: Rute Detail Villa sekarang dilindungi */}
        <Route path="/villa-detail/:id" element={<DetailsVilla />} /> {/* */}
        {/* Pastikan rute booking ini memiliki parameter :villaId */}
        <Route path="/booking/:villaId" element={<Booking />} />
        <Route path="/payment/:bookingId" element={<Payment />} />
        <Route path="/confirmation/:bookingId" element={<Confirmation />} />
        <Route path="/invoice/:bookingId" element={<Invoice />} />
      </Route>

      {/* Rute Khusus Owner */}
      <Route element={<ProtectedRoute allowedRoles={["owner", "admin"]} />}>
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/add-villa" element={<AddVilla />} />
      </Route>

      {/* Rute Khusus Admin */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}
