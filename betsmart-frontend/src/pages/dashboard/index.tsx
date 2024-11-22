import React from "react";
import Link from "next/link";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      {/* Top row buttons*/}
      <div className="top-row">
        <div className="spacer"> </div>
        <Link href="/createWager" className="create-wager-button"> Create Wager </Link>
        <div className="spacer"> </div>
      </div>

      
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
};

export default Dashboard;
