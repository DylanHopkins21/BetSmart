import React from "react";
import { FaTimes } from "react-icons/fa";
import "./notifModal.css";
import NotificationCard from "../notifCard/notifCard";

interface NotifModalProps {
  show: boolean;
  onClose: () => void;
  notifications: {
    id: number;
    inviterName: string;
    wagerName: string;
  }[];
  onViewDetails: (id: number) => void;
  onAccept: (id: number) => void;
  onDeny: (id: number) => void;
}

const NotifModal: React.FC<NotifModalProps> = ({
  show,
  onClose,
  notifications,
  onViewDetails,
  onAccept,
  onDeny,
}) => {
  return (
    <div className={`modal-overlay ${show ? "fade-in" : "fade-out"}`}>
      <div className={`modal ${show ? "slide-in" : "slide-out"}`}>
        <button className="modal-close-button" onClick={onClose}>
          <FaTimes size={20} />
        </button>
        <h2>
          {notifications.length} New Notification
          {notifications.length !== 1 ? "s" : ""}
        </h2>
        <div>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              inviterName={notification.inviterName}
              wagerName={notification.wagerName}
              onViewDetails={() => onViewDetails(notification.id)}
              onAccept={() => onAccept(notification.id)}
              onDeny={() => onDeny(notification.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotifModal;
