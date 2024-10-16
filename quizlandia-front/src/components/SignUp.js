import React, { useState } from 'react';
import { TextField, Button, Text } from '@mui/material';
import { signupUser } from '../functions/authFunctions';

function SignUp(props) {
    const [email, setEmail] = useState('');
    const [repeatEmail, setRepeatEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState(null);
    const validateEmailFormat = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validate = () => {
        if (!validateEmailFormat(email)) {
            setError("Invalid email format");
            return
        } else if (email !== repeatEmail) {
            setError("Emails do not match");
            return
        } else if (password !== repeatPassword) {
            setError("Passwords do not match")
            return
        } else if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return
        } else if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one uppercase letter');
            return
        } else if (!/[a-z]/.test(password)) {
            setError('Password must contain at least one lowercase letter')
            return
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const signup = await signupUser(email, password);
            if(signup.error){
                setError({email: signup.error});
                return;
            } else {
                props.setUid(signup.uid);

            }
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px', width: '100%' }}>
            <TextField
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                Sign Up
            </Button>
            <Button variant="text" color="primary" style={{ marginTop: '10px' }} onClick={() => props.setSigninFlow(true)}>
                Already have an account? Sign In
            </Button>
            {error && <text style={{color: 'red', textAlign: 'center'}}>{error}</text>}
        </form>
    );
}

export default SignUp;