import React, { useEffect, useState } from "react";
import "./Timeline.css";

interface TimelineProps {
    duration: number; // seconds
}

const Timeline = ({ duration }: TimelineProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(duration);

    useEffect(() => {
        const start = performance.now();

        const timer = requestAnimationFrame(function update(timestamp) {
            const elapsed = (timestamp - start) / 1000;
            const remaining = Math.max(0, duration - elapsed);
            setTimeLeft(remaining);

            if (remaining > 0) {
                requestAnimationFrame(update);
            }
        });

        return () => cancelAnimationFrame(timer); 
    }, [duration]);

    const percentage = (timeLeft/duration) * 100;
    const progressColor = percentage > 50 ? "green" : percentage > 20 ? "yellow" : "red";

    return (
        <div className="timeline">
            <div
                className="timebar"
                style={{
                    width: `${percentage}%`,
                    backgroundColor: progressColor,
                }}
            ></div>
            <div className="timelabel">{Math.ceil(timeLeft)}s left</div>
        </div>
    );
};

export default Timeline;
