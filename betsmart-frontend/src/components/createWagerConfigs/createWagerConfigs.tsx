import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React, { useState } from 'react';
import './CreateWagerConfigs.css';

/*
    props.classes : List of String of class names
    props.assignments : Dictionary w/ String class names as keys and List of String assignment names as values

*/
export default function CreateWagerConfigs() {

    /* TO BE REPLACED*/
    const classList = ["CS61A", "CS61B", "CS61C", "CS70"]; 
    const assignmentList = ["Ants", "Hog", "Perculation", "Project 1"]
    /* TO BE REPLACED*/

    const [currentClass, setCurrentClass] = useState("");
    const [currentAssignment, setCurrentAssignment] = useState("");
    const [wagerAmount, setWagerAmount] = useState(0);
    const [error, setError] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (/^\d*\.?\d*$/.test(value) && value) { // Validates numeric input
            const intValue = parseInt(value, 10);
            setWagerAmount(intValue);
            setError(false);
        } else {
            setWagerAmount(0);
            setError(true);
        }
      };
    
      const handleClassChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setCurrentClass(value);
      }

      const handleAssignmentChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setCurrentAssignment(value);
      }



    return (
        <div>
            <h3 className="categoryLabel">Classes</h3>
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 160}}>
                <InputLabel id="class-select-label">Select a Class</InputLabel>
                <Select
                labelId="class-select-label"
                value={currentClass}
                onChange={handleClassChange}
                label="Select a Class"
                >
                {classList.map((className) => (
                    <MenuItem key={className} value={className}>
                    {className}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>

            <h3 className="categoryLabel">Assignment</h3>
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 160}}>
                <InputLabel id="assignment-select-label">Select a Assignment</InputLabel>
                <Select
                labelId="assignment-select-label"
                value={currentAssignment}
                onChange={handleAssignmentChange}
                label="Select a Assigment"
                >
                {assignmentList.map((aName) => (
                    <MenuItem key={aName} value={aName}>
                    {aName}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>

            <h3 className="categoryLabel">Wager</h3>
            <TextField
                label="Enter Wager Amount"
                variant="outlined"
                value={wagerAmount}
                onChange={handleChange}
                error={error}
                helperText={error ? "Invalid input" : ""}/>
            <h3 className="categoryLabel">Invites</h3>
            <TextField label='Enter email' variant='outlined'/>

        </div>
    )
}