"use client";

import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { FaArrowRight } from 'react-icons/fa';
import { useUniversity } from './UniversityContext';

function EmailInput() {
  const [email, setEmail] = useState('');
  const { university } = useUniversity();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.endsWith(`@${university.emailDomain}`)) {
        alert(`Please enter a valid ${university.shortName} email address (@${university.emailDomain})`);
    }
    else {
      alert("g");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label={`${university.shortName} Email`}
        type="email"
        variant="outlined"
        size="small"
        value={email}
        onChange={handleEmailChange}
        placeholder={`@${university.emailDomain}`}
      />
      <Button type="submit" variant="contained" className='mx-1'>
            Go <FaArrowRight className="ml-1" />
      </Button>
    </form>
  );
}

export default EmailInput;
