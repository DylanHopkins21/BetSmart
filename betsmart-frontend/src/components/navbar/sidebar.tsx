import React from "react";
import Link from "next/link";
import { FaUser, FaTh, FaClock, FaBell, FaPlus } from "react-icons/fa";
import "../../components/navbar/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-notification">
          <FaBell size={20} />
          <span className="sidebar-badge">1</span>
        </div>
        <div className="sidebar-wallet">
          <span className="sidebar-wallet-amount">$0</span>
          <button className="sidebar-add-button">
            <FaPlus size={12} />
          </button>
        </div>
      </div>

      <div className="sidebar-links">
        <Link href="/profile" className="sidebar-link">
          <FaUser size={20} className="sidebar-icon" /> Profile
        </Link>
        <Link href="/dashboard" className="sidebar-link">
  <FaTh size={20} className="sidebar-icon" /> Dashboard
</Link>
        <Link href="/history" className="sidebar-link">
          <FaClock size={20} className="sidebar-icon" /> History
        </Link>
      </div>
      <div className="sidebar-footer">
        <h3 className="sidebar-logo">BetSmart</h3>
        <div className="betsmart-logo">
          <img 
            src="https://i.ibb.co/c6tbLXR/betsmartlogo.png" 
            alt="BetSmart Logo" 
            className="logo-image" 
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
