import React from 'react';
import './EmailTag.css';
import { RxCross2 } from "react-icons/rx";


interface EmailTagProps {
    email: string;
    removeFunc: (x:string) => void;
}

export default function EmailTag({ email, removeFunc} : EmailTagProps){
    const handleClick = () => {
        removeFunc(email);
        
    }
    return (
        <div className='email'>
            <div className='email-text'>
                {email}
            </div>
            <button onClick={handleClick} className='delete-button'>
                <RxCross2/>
            </button>
        </div>
)}