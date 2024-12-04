import React from 'react';
import Box from '@mui/material/Box';
import "./wager.css";
import "./Timeline.css"
import Timeline from "./Timeline";

interface WagerProps {
    name: string; 
    semester: string;
    image: string;
    timeLeft: number; 
    entry: number; 
    partNum: number; 
    win?: boolean; 
}

export default function Wager({ name, semester, image, timeLeft, entry, partNum, win }: WagerProps) {
    return (
        <div className='wagerComp'>
            <div className='aboveLine'>
                <div className='leftSide'>
                    <div className = 'name'>{name}</div>
                    <div className = 'sem'>
                        {semester}
                        {win !== undefined && (
                        <div className={`wonOrLost ${win ? 'win' : 'lose'}`}>
                            {win ? `+$${entry}` : `-$${entry}`}
                        </div>
                        )}
                    </div>

                </div>
                <div className='rightSide'>
                        <img className='img' src={image} alt={`${name}'s avatar`} />
                        {/*add gradient*/}
                </div>
            </div>

            <div className='timer'>
                <Timeline duration={timeLeft}/>
            </div>

            <div className='belowLine'>
                <div className='entryFlex'>
                    {entry}
                    <p style ={{opacity: 0.5}} className = 'pstyle'>Entry</p>
                </div>
                <div className='entryFlex'>
                    {partNum}
                    <p style ={{opacity: 0.5}} className = 'pstyle'>Participants</p>
                </div>
                <div className='entryFlex'>
                    <div>${entry * partNum}</div>
                    <p style ={{opacity: 0.5}} className = 'pstyle'>Prize</p>
                </div>
            </div>
        </div>
    );
}
