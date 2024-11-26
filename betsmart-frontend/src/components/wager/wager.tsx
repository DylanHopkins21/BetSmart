import React from 'react';
import Box from '@mui/material/Box';
import './wager.css';



interface WagerProps {
    name: String; 
    semester: String;
    image: String;
    timeLeft: number; //goes down 
    entry: number; 
    partNum: number; //participants number

}

export default function Wager({ name, semester, image, timeLeft, entry, partNum} : WagerProps){
    //need to gather the information from the submit 


    //do it for a set value 
    return (
        <div className='wagerComp'>
            <div className='aboveLine'>
                <div className='leftSide'>
                    {name}
                    {semester}
                </div>
                //rightside
                <div className = 'rightSide'>
                    <img>
                        //just put in the url or smth
                        //make sur there's an image gradient 
                    </img>
                 </div>
            </div>
            //moving time line for line 
            /*PUT HERE*/

            <div className='belowLine'>
                <div className='entryFlex'>
                    {entry}
                    <p>Entry</p>
                </div>
                <div className='partsFlex'>
                    {partNum}
                    <p>Participants</p>
                </div>
                <div className='prizeFlex'>
                    {entry*partNum}
                    <p>Prize</p>
                </div>
            </div>
        </div>
)}