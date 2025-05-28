import React from "react";
import classNames from "classnames";
import "../styles/profile.css"; // Pastikan file CSS ini ada dan sesuai

const ActivityItem = ({ date, month, name, status, price }) => {
  return (
    <div className="activity-item">
      <div className="activity-date">
        <div className="date">{date}</div>
        <div className="month">{month}</div>
      </div>

      <div className="activity-detail">
        <div className="villa-name">{name}</div>
        {status && (
          <div
            className={classNames("status", {
              "status-booked": status === "BOOKED",
              "status-cancelled": status === "CANCELLED",
            })}
          >
            {status}
          </div>
        )}
      </div>

      <div className="price">{price}</div>
    </div>
  );
};

export default ActivityItem;
