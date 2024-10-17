import React, { useState } from 'react';
import { Button } from '@mui/material';
import { authWithGoogle } from '../functions/authFunctions';
const GoogleAuth = () => {

    const [error, setError] = useState(null);

    async function authenticate() {
        const authObj = await authWithGoogle();
        if (authObj.error) {
            setError(authObj.error);
            return;
        }
    }

    return (
        <div>
            <Button variant="contained" color="primary" onClick={authenticate}>Authenticate with Google</Button>
            {error && <text style={{ color: 'red', textAlign: 'center' }}>{error}</text>}
        </div>
    );
};

export default GoogleAuth;