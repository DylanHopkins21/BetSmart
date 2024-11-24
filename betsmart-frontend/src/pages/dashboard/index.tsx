import React from "react";
import Link from "next/link";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="create-section">
          <Link href="/createWager" className="create-wager-button">
            <div className="create-button-icon">+</div>
            Create
          </Link>
        </div>
        <div className="title-section">
          <h1>WAGERS</h1>
        </div>
      </div>

      {/* audrey needs to replcae the placeholders with teh actual cards */}
      <div className="wager-section">
        <div className="wager-list">
          <div className="wager-card-placeholder">CS70 Midterm</div>
          <div className="wager-card-placeholder">CS162 Project 2</div>
          <div className="wager-card-placeholder">Poop DeCal HW 1</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
