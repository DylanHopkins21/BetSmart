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
        <Link href="/home" className="sidebar-link">
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
            src="https://cdn.discordapp.com/attachments/1304631558472208394/1306825521866211338/image.png?ex=6738139c&is=6736c21c&hm=38dec34750214f8480a0d5bde14dcefe5bfc36bef4883a563de7e0afce840e60&" 
            alt="BetSmart Logo" 
            className="logo-image" 
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
