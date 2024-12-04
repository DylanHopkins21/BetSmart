import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Button, styled} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import React, { useState } from 'react';
import './CreateWagerConfigs.css';
import { FaDollarSign } from "react-icons/fa";
import EmailTag from '../EmailTag/EmailTag';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { RxCross2 } from "react-icons/rx";
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
    const [image, setImage] = useState("");
    const [emailList, setEmailList] = useState<string[]>([]);
    const [emailInput, setEmailInput] = useState("");
    const router = useRouter();

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

    const handleWagerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (/^\d*\.?\d*$/.test(value) && value) { // Validates numeric input
            const intValue = parseInt(value, 10);
            setWagerAmount(intValue);
        } else if (!value) {
            setWagerAmount(0);
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
        const maxSize = 10 * 1024 * 1024; //10MB

        if (file) {

            if (file.size > maxSize) {
                alert("The file size exceeds the 10MB limit. Please upload a smaller file.");
                return;
            }
            const reader = new FileReader();

            reader.onload = () => {
                setImage(reader.result as string);
            }

            reader.readAsDataURL(file);
        }

      }

      const handleEnterEmail = (event: React.KeyboardEvent<HTMLInputElement>) => {
        
        if (event.key === "Enter" && emailInput) {
            if (emailList.includes(emailInput)) {
                alert("Email has already been added.")
            } else {
                setEmailList([...emailList, emailInput])
            }
            setEmailInput("");
        }
      }


      const removeFromEmailList = (emailToRemove: string) => {
            const ind = emailList.indexOf(emailToRemove);
            if (ind != -1){
                const newEmailList = [...emailList];
                newEmailList.splice(ind, 1);
                setEmailList(newEmailList);
                console.log('Successfully removed ' + emailToRemove)
            }
      }


      const handleSubmit = () => {
        if (currentClass && currentAssignment && wagerAmount !== 0 && emailList.length > 0) {
          router.push('/dashboard'); 
        } else {
          alert('All required fields must be filled.');
        }
      };

    return (
        <div className='createWagerBox'>
            {/* TITLE */}
            <div className='title'>
                <FaDollarSign className='dollarIcon'/> 
                <h1 className='titleText'> NEW WAGER </h1>
                <Link href='dashboard' className='cancel-button'>
                    <RxCross2/>
                </Link>
            </div>
            <div className='wagerContent'>
                <div className='side-space'></div>
                {/*SELECTIONS*/}
                <div className='wagerSelects'>
                    {/*CLASS SELECTION*/}
                    <h3 className="categoryLabel">Classes:</h3>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 160}} className='custom-select'>
                        <InputLabel id="class-select-label">Select Class</InputLabel>
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
                    <div className="select-spacer"></div>
                    {/*ASSIGNMENT SELECTION*/}
                    <h3 className="categoryLabel">Assignment:</h3>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 160}} className='custom-select'>
                        <InputLabel id="assignment-select-label">Select Assignment</InputLabel>
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
                    <div className="select-spacer"></div>
                    {/*SET WAGER AMOUNT*/}
                    <h3 className="categoryLabel">Wager:</h3>
                    <TextField
                        className='custom-select'
                        label="Enter Wager Amount ($)"
                        variant="filled"
                        value={wagerAmount}
                        onChange={handleWagerChange}/>

                    <div className="select-spacer"></div>
                    <h3 className="categoryLabel">Invites:</h3>
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
                            <EmailTag key={index} email={email} removeFunc={removeFromEmailList}/>
                        ))}
                    </h3>

                    
                </div>

                <div className = 'middle-space'></div>

                {/* UPLOAD IMAGE */}
                <div className='imageUpload'>
                        <h3 className='upload-text'>Upload Image</h3>
                    {/* Upload Button*/}
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
                    
                    {/* Display Uploaded Image*/}
                    {image && <img src={image} alt="Uploaded Preview" className="uploaded-image"/>}


                    {/* SUBMIT BUTTON*/}
                    <div className='submitButton'>
                        <div className='buttonAligner'>
                            <div className='submit-button'>
                                <Button variant='text' onClick={handleSubmit} 
                                sx={{color: 'white', 
                                fontFamily: 'inherit', fontSize: 'large', 
                                fontWeight: 'bold'
                                }}>
                                    SUBMIT
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='side-space'></div>
            </div>
        </div>
    )
}