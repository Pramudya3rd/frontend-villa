// frontend-sewa-villa/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import NavbarProfile from "../components/NavbarProfile"; //
import ProfileCard from "../components/ProfileCard"; //
import ActivityCard from "../components/ActivityCard"; //
import { useAuth } from "../context/AuthContext"; // Import useAuth
import "../styles/profile.css"; //
import avatarImg from "../assets/profile.jpg"; //

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage = () => {
  const { user, token } = useAuth(); // Get user and token from context
  const [profileData, setProfileData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndBookings = async () => {
      if (!token || !user) {
        setLoading(false);
        setError("User not authenticated. Please log in.");
        return;
      }

      try {
        // Fetch User Profile
        const profileRes = await fetch(`${BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setProfileData(profile);
        } else {
          const errorData = await profileRes.json();
          setError(errorData.message || "Failed to fetch profile.");
        }

        // Fetch User Bookings
        const bookingsRes = await fetch(
          `${BASE_URL}/api/bookings/my-bookings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (bookingsRes.ok) {
          const bookings = await bookingsRes.json();
          setActivities(bookings);
        } else {
          const errorData = await bookingsRes.json();
          setError(errorData.message || "Failed to fetch activities.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Network error or server unavailable.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndBookings();
  }, [user, token]); // Re-fetch if user or token changes

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!profileData) return <p>No profile data available.</p>;

  const displayUser = {
    avatar: profileData.avatar || avatarImg, // Use fetched avatar or default
    name: profileData.name,
    email: profileData.email,
    phone: profileData.phone,
  };

  return (
    <>
      <NavbarProfile />
      <div className="profile-page">
        <ProfileCard user={displayUser} />
        <ActivityCard activities={activities} />
      </div>
    </>
  );
};

export default ProfilePage;
