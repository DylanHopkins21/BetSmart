import React from "react";
import Link from "next/link";
import "./history.css";
import Wager from "@/components/wager/wager";
import monkeyImage from './images/monkeyimage.jpg'; 

const History = () => {
  return (
    <div className="history-container">
      <div className="history-header">
        <div className="create-section">
          <Link href="/createWager" className="create-wager-button">
            <div className="create-button-icon">+</div>
            Create
          </Link>
        </div>
        <div className="title-section">
          <h1>HISTORY</h1>
        </div>
      </div>

      <div className = "totEarnings">
        
      </div>

      <div className = "pastWagers">
        
      </div>
    </div>
  );
};

export default History;
