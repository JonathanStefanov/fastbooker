import Button from '@mui/material/Button';

export default function Hour({ hour }) {
    return(
        <Button variant="contained" style={{maxWidth: '50px', maxHeight: '30px', minWidth: '50px', minHeight: '30px'}}>
            <p>{hour.hour}</p>
        </Button>
    );
}