"use client";

import Button from '@mui/material/Button';

export default function Hour({ hour, onClick }) {
    return(
        <Button 
            variant="contained" 
            style={{maxWidth: '50px', maxHeight: '30px', minWidth: '50px', minHeight: '30px'}}
            onClick={onClick}
        >
            <p>{hour.hour}</p>
        </Button>
    );
}