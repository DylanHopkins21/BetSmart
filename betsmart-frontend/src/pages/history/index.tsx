import React from "react";
import Link from "next/link";
import "./history.css";
import Wager from "@/components/wager/wager";
import monkeyImage from './images/monkeyimage.jpg'; 
import { CiWallet } from "react-icons/ci";

interface HistoryProps {
  earnings: number; 
}

export function History({ earnings = 50 }: HistoryProps) {
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
        <CiWallet className = "wallet" />
        MY TOTAL EARNINGS
        <div className = "earningNumBox">
          <p>${earnings}</p>
        </div>
      </div>

      <div className = "pastWagers">
        <div className = "pastWagersTitle">
          $ PAST WAGERS
        </div>
        <Wager
              name="CS61B Midterm 2"
              semester="Fall 2021"
              image="/images/longimage.jpg"
              entry={5}
              partNum={7}
              timeLeft={60}
              win = {false}
        />
        <Wager
              name="Poo Poo Decal"
              semester="Fall 2030"
              image="/images/longimage2.jpg"
              entry={10}
              partNum={10}
              timeLeft={100}
              win = {true}
        />
        <Wager
              name="CS 70 Final"
              semester="Fall 2022"
              image="/images/monkeyimage.jpg"
              entry={12}
              partNum={48}
              timeLeft={200}
              win = {false}
        />
      </div>
    </div>
  );
};

export default History;
