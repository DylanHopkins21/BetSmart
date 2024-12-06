import React from "react";
import "@/components/navbar/notifModal/notifModal.css";

interface WagerModalProps {
  name: string;
  semester: string;
  image: string;
  entry: number;
  partNum: number;
  timeLeft: number;
  onClose: () => void;
}

export default function WagerModal({
  name,
  semester,
  image,
  entry,
  partNum,
  timeLeft,
  onClose,
}: WagerModalProps) {
  return (
    <div className="modal-overlay fade-in">
      <div className="modal slide-in">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>{name}</h2>
        <p>{semester}</p>
        <img src={image} alt={name} style={{ width: "100%", borderRadius: "10px" }} />
        <div>
          <p>Entry Fee: ${entry}</p>
          <p>Participants: {partNum}</p>
          <p>Total Prize: ${entry * partNum}</p>
          <p>Time Left: {timeLeft} minutes</p>
        </div>
      </div>
    </div>
  );
}
