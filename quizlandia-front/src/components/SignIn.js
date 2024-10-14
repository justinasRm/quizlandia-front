import React from 'react';
import { TextField, Button } from '@mui/material';

function SignIn(props) {
    console.log(props)
    return (
        <form style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px', width: '100%' }}>
            <TextField
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                required
                fullWidth
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                required
                fullWidth
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                Sign In
            </Button>
            <Button variant="text" color="primary" style={{ marginTop: '10px' }} onClick={() => props.setSigninFlow(false)}>
                Don't have an account? Sign Up
            </Button>
        </form>
    );
}

export default SignIn;