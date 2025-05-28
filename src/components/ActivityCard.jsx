import React from "react";
import ActivityItem from "./ActivityItem";

const ActivityCard = ({ activities }) => {
  return (
    <div className="activity-card">
      <h3 className="activity-title">ACTIVITY</h3>
      {activities.map((activity, index) => (
        <ActivityItem key={index} {...activity} />
      ))}
    </div>
  );
};

export default ActivityCard;
