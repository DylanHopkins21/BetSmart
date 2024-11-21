import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Button, styled} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import React, { useState } from 'react';
import './CreateWagerConfigs.css';
import { FaDollarSign } from "react-icons/fa";

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
    const [image, setImage] = useState("");
    const [emailList, setEmailList] = useState<string[]>([]);
    const [emailInput, setEmailInput] = useState("");

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });

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

      const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                setImage(reader.result as string);
            }

            reader.readAsDataURL(file);
        }

      }

      const handleEnterEmail = (event: React.KeyboardEvent<HTMLInputElement>) => {
        
        if (event.key === "Enter" && emailInput) {
            setEmailList([...emailList, emailInput])
            setEmailInput("");
        }
      }



    return (
        <div className='createWagerBox'>
            {/* TITLE */}
            <div className='title'>
                <FaDollarSign className='dollarIcon'/> 
                <h1 className='titleText'> NEW WAGER </h1>
            </div>
            <div className='wagerContent'>
                <div className = 'spacer'></div>
                {/*SELECTIONS*/}
                <div className='wagerSelects'>
                    {/*CLASS SELECTION*/}
                    <h3 className="categoryLabel">Classes</h3>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 160}} className='custom-select'>
                        <InputLabel id="class-select-label" className='custom-select'>Select a Class</InputLabel>
                        <Select
                        labelId="class-select-label"
                        value={currentClass}
                        onChange={handleClassChange}
                        label="Select a Class"
                        className='custom-select'
                        >
                        {classList.map((className) => (
                            <MenuItem key={className} value={className}>
                            {className}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    
                    {/*ASSIGNMENT SELECTION*/}
                    <h3 className="categoryLabel">Assignment</h3>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 160}} className='custom-select'>
                        <InputLabel id="assignment-select-label" className='custom-select'>Select a Assignment</InputLabel>
                        <Select
                        labelId="assignment-select-label"
                        value={currentAssignment}
                        onChange={handleAssignmentChange}
                        label="Select a Assigment"
                        className='custom-select'
                        >
                        {assignmentList.map((aName) => (
                            <MenuItem key={aName} value={aName}>
                            {aName}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    
                    {/*SET WAGER AMOUNT*/}
                    <h3 className="categoryLabel">Wager</h3>
                    <TextField
                        className='custom-select'
                        label="Enter Wager Amount"
                        variant="filled"
                        value={wagerAmount}
                        onChange={handleChange}
                        error={error}
                        helperText={error ? "Invalid input" : ""}/>
                    <h3 className="categoryLabel">Invites</h3>

                    {/*ENTER EMAIL INVITES*/}
                    <TextField 
                        label='Enter email' 
                        variant='filled' 
                        className='custom-select'
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setEmailInput(event.target.value)}}
                        onKeyDown={handleEnterEmail}
                        value={emailInput}
                        />
                    
                    <h3 className="emailList">
                        {emailList.map((email, index) => (
                            <div key={index} className="email">{email}</div>
                        ))}
                    </h3>

                    
                </div>

                <div className = 'spacer'></div>

                {/* UPLOAD IMAGE */}
                <div className='imageUpload'>
                    <h3 className="categoryLabel">Upload Image</h3>

                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        >
                        Upload files
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleImageUpload}
                            accept="image/*"
                        />
                    </Button>

                    {image && <img src="image" alt="Uploaded Preview" />}


                    {/* SUBMIT BUTTON*/}
                    <div className='submitButton'>
                        <div className='buttonAligner'>
                            <Button variant="contained">Submit</Button>
                        </div>
                    </div>
                </div>
                <div className='spacer'></div>

            </div>
        </div>
    )
}