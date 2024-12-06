import React, { useState } from "react";
import Link from "next/link";
import "./dashboard.css";
import Wager from "@/components/wager/wager";
import WagerModal from "@/components/wagerModal/modal";

const Dashboard = () => {
  const [selectedWager, setSelectedWager] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWagerClick = (wagerData) => {
    setSelectedWager(wagerData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWager(null);
  };

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

      <div className="wager-section">
        <div className="wager-list">
          {/* Replace placeholders with cards */}
          <div
            onCl oh almost doneick={() =>
              handleWagerClick({
                name: "CS61B Midterm 2",
                semester: "Fall 2021",
                image: "/images/longimage.jpg",
                entry: 5, got
                partNum: 7,
                timeLeft: 60,
              })
            }
          >
            <Wager
              name="CS61B Midterm 2"
              semester="Fall 2021"
              image="/images/longimage.jpg"
              entry={5}
              partNum={7}
              timeLeft={60}
            />
          </div>

          <div
            className="wager-card-placeholder"
            onClick={() =>
              handleWagerClick({
                name: "CS162 Project 2",
                semester: "Fall 2021",
                image: monkeyImage,
                entry: 10,
                partNum: 5,
                timeLeft: 120,
              })
            }
          >
            CS162 Project 2
          </div>

          <div
            className="wager-card-placeholder"
            onClick={() =>
              handleWagerClick({
                name: "Poop DeCal HW 1",
                semester: "Spring 2022",
                image: "/images/poopImage.jpg",
                entry: 1,
                partNum: 10,
                timeLeft: 15,
              })
            }
          >
            Poop DeCal HW 1
          </div>
        </div>
      </div>

      {isModalOpen && selectedWager && (
        <WagerModal
          name={selectedWager.name}
          semester={selectedWager.semester}
          image={selectedWager.image}
          entry={selectedWager.entry}
          partNum={selectedWager.partNum}
          timeLeft={selectedWager.timeLeft}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
