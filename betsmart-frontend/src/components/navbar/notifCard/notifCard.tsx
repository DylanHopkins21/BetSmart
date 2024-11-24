import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import "./notifCard.css"

interface NotificationCardProps {
  inviterName: string;
  wagerName: string;
  onViewDetails: () => void;
  onAccept: () => void;
  onDeny: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  inviterName,
  wagerName,
  onViewDetails,
  onAccept,
  onDeny,
}) => {
  return (
    <div className="notification-card">
      <div className="notification-text">
        <strong>{inviterName}</strong> invited you to participate in <em>{wagerName}</em>
      </div>
      <div className="notification-actions">
        <button className="view-details-btn" onClick={onViewDetails}>
          View Details
        </button>
        <button className="accept-btn" onClick={onAccept}>
          <FaCheck size={16} />
        </button>
        <button className="deny-btn" onClick={onDeny}>
          <FaTimes size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
