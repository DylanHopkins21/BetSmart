import React from "react";
import { FaTimes } from "react-icons/fa";
import "./notifModal.css";

interface NotifModalProps {
  show: boolean;
  onClose: () => void;
}

const NotifModal: React.FC<NotifModalProps> = ({ show, onClose }) => {
  return (
    <div className={`modal-overlay ${show ? "fade-in" : "fade-out"}`}>
      <div className={`modal ${show ? "slide-in" : "slide-out"}`}>
        <button className="modal-close-button" onClick={onClose}>
          <FaTimes size={20} />
        </button>
        <h2>(insert cards)</h2>
      </div>
    </div>
  );
};

export default NotifModal;
