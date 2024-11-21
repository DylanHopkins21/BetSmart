import React from "react";
import CreateWagerConfigs from "@/components/CreateWagerConfigs/CreateWagerConfigs";
import "./createWager.css";

const CreateWager = () => {
  return (
    <div className='whole-page'>
        <div className='page-title'>
            <div className="spacer"></div>
            <h1 className='title-label'>CREATE WAGER</h1>
        </div>
        <CreateWagerConfigs/>
    </div>
  );
};

export default CreateWager;