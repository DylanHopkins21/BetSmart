import { MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';
import './createWagerConfig.css';

/*
    props.classes : List of String of class names
    props.assignments : Dictionary w/ String class names as keys and List of String assignment names as values

*/
export default function createWagerConfig() {
    const [chosenClass, setChosenClass] = useState("");
    const [chosenAssignment, setChosenAssignment] = useState("");
    const [wagerAmount, setWagerAmount] = useState(0);
    const [invites, setInvites] = useState([]);


    return (
        <div>
            
            <h3 className="categoryLabel">Class</h3>
            <h3 className="categoryLabel">Assignment</h3>
            <h3 className="categoryLabel">Wager</h3>
            <TextField label='Enter Wager Amount' variant='outlined'/>
            <h3 className="categoryLabel">Invites</h3>
            <TextField label='Enter email' variant='outlined'/>

        </div>
    )
}