import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

function SignUp(props) {
    const [email, setEmail] = useState('');
    const [repeatEmail, setRepeatEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validateEmailFormat = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validate = () => {
        let tempErrors = {};
        if (!validateEmailFormat(email)) tempErrors.email = "Invalid email format";
        if (email !== repeatEmail) tempErrors.repeatEmail = "Emails do not match";
        if (password !== repeatPassword) tempErrors.password = "Passwords do not match";
        if(password.length < 8) tempErrors.password = "Password must be at least 8 characters long";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Proceed with form submission
            console.log("Form submitted");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px', width: '100%' }}>
            <TextField
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
            />
            <TextField
                label="Repeat Email"
                type="email"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={repeatEmail}
                onChange={(e) => setRepeatEmail(e.target.value)}
                error={!!errors.repeatEmail}
                helperText={errors.repeatEmail}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
            />
            <TextField
                label="Repeat Password"
                type="password"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                Sign Up
            </Button>
            <Button variant="text" color="primary" style={{ marginTop: '10px' }} onClick={() => props.setSigninFlow(true)}>
                Already have an account? Sign In
            </Button>
        </form>
    );
}

export default SignUp;