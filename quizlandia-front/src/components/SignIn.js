import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { loginUser } from '../functions/authFunctions';

function SignIn(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Užpildykite visus laukus');
            return;
        }
        const login = await loginUser(email, password);
        if (login.error) {
            setError(login.error);
            return;
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
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                Prisijungti
            </Button>
            <Button variant="text" color="primary" style={{ marginTop: '10px' }} onClick={() => props.setSigninFlow(false)}>
                Neturi paskyros? Užsiregistruok!
            </Button>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        </form>
    );
}

export default SignIn;