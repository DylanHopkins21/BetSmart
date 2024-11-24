import React, { useState } from "react";
import Link from "next/link";
import { FaUser, FaTh, FaClock, FaBell, FaPlus } from "react-icons/fa";
import "./sidebar.css";
import NotifModal from "./notifModal/notifModal";

const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);

  // example for now
  const notifications = [
    { id: 1, inviterName: "Dylan Hopkins", wagerName: "Math 69 Final" },
    { id: 2, inviterName: "Audrey Zhang", wagerName: "CS61B Project 3" },
    { id: 3, inviterName: "Big Johnson", wagerName: "Sending 101 HW 2" }
  ];

  const handleNotificationClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleViewDetails = (id: number) => {
    console.log(`Viewing details for notification ID: ${id}`);
  };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-top">
          <div
            className="sidebar-notification"
            onClick={handleNotificationClick}
            style={{ cursor: "pointer" }}
          >
            <FaBell size={20} />
            <span className="sidebar-badge">{notifications.length}</span>
          </div>
          <div className="sidebar-wallet">
            <span className="sidebar-wallet-amount">$0</span>
            <button className="sidebar-add-button">
              <FaPlus size={12} />
            </button>
          </div>
        </div>

        <div className="sidebar-links">
          <Link href="/dashboard" className="sidebar-link">
            <FaTh size={20} className="sidebar-icon" /> Dashboard
          </Link>
          <Link href="/history" className="sidebar-link">
            <FaClock size={20} className="sidebar-icon" /> History
          </Link>


          <div className="sidebar-footer">
          <div className="betsmart-logo">
            <img className= "logoPic"
              src="https://i.ibb.co/c6tbLXR/betsmartlogo.png"
              alt="BetSmart Logo"
              className="logo-image"
            />
        </div>
        {/* <h3 className="sidebar-logo">BetSmart</h3> */}
        <div className="sidebar-logout">
          <Link href="/signup" className="sidebar-link">
            <FaUser size={20} className="sidebar-icon" /> Log Out
          </Link>
        </div>
        </div>

        </div>
        

      </div>

      {/* Notification Modal */}
      <NotifModal
        show={showModal}
        onClose={handleCloseModal}
        notifications={notifications} // Pass notifications array
        onViewDetails={handleViewDetails} // Pass view details handler
      />
    </>
  );
};

export default Sidebar;
