// frontend-sewa-villa/src/components/ProfileCard.jsx
import React from "react";
import "../styles/profile.css";

const ProfileCard = ({ user }) => {
  // Pastikan user memiliki properti yang diharapkan (name, email, phone, avatar)
  // Fallback jika properti tidak ada
  const userAvatar =
    user?.avatar || "https://i.ibb.co/NC56z9J/default-avatar.jpg";

  return (
    <div className="profile-card">
      <div className="profile-photo">
        <img src={userAvatar} alt="avatar" />
      </div>
      <div className="profile-info">
        <h2 className="profile-name">{user?.name || "N/A"}</h2>
        <div className="profile-detail">
          <div className="label">Email</div>
          <div className="value">
            <a href={`mailto:${user?.email}`}>{user?.email || "N/A"}</a>
          </div>
        </div>
        <div className="profile-detail">
          <div className="label">Phone Number</div>
          <div className="value">{user?.phone || "N/A"}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
