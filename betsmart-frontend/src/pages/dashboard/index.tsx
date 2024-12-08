import React from "react";
import Link from "next/link";
import "./dashboard.css";
import Wager from "@/components/wager/wager";
import { useUser } from "@/contexts/UserContext";

const Dashboard = () => {
  const { user } = useUser();  // Access the user context

  // Now you can access user.email and user.password
  const email = user?.email;
  const password = user?.password;

  console.log(email + " " + user);
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
          <Wager
              name="CS61B Midterm 2"
              semester="Fall 2021"
              image="/images/longimage.jpg"
              entry={5}
              partNum={7}
              timeLeft={60}
          />

          <div className="wager-card-placeholder">CS162 Project 2</div>
          <div className="wager-card-placeholder">Poop DeCal HW 1</div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
