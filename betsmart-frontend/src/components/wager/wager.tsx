import React from 'react';
import './wager.css';
import './Timeline.css';
import Timeline from './Timeline';

interface WagerProps {
  name: string;
  semester: string;
  image: string;
  timeLeft: number;
  entry: number;
  partNum: number;
  onClick: () => void;
}

export default function Wager({ name, semester, image, timeLeft, entry, partNum, onClick }: WagerProps) {
  return (
    <div className="wagerComp" onClick={onClick}>
      <div className="aboveLine">
        <div className="leftSide">
          <div className="name">{name}</div>
          <div className="sem">{semester}</div>
        </div>
        <div className="rightSide">
          <img className="img" src={image} alt={`${name}'s avatar`} />
        </div>
      </div>

      <div className="timer">
        <Timeline duration={timeLeft} />
      </div>

      <div className="belowLine">
        <div className="entryFlex">
          {entry}
          <p className="pstyle" style={{ opacity: 0.5 }}>
            Entry
          </p>
        </div>
        <div className="entryFlex">
          {partNum}
          <p className="pstyle" style={{ opacity: 0.5 }}>
            Participants
          </p>
        </div>
        <div className="entryFlex">
          <div>${entry * partNum}</div>
          <p className="pstyle" style={{ opacity: 0.5 }}>
            Prize
          </p>
        </div>
      </div>
    </div>
  );
}
