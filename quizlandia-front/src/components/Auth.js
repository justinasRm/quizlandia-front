import React, { useEffect, useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import SignIn from './SignIn';
import SignUp from './SignUp';

function Auth(props) {
    const [signinFlow, setSigninFlow] = useState(true);

    useEffect(() => {
        console.log('CHANGE: ', signinFlow);
    }, [signinFlow]);
    return (
        <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to <em style={{ color: 'blue' }}>Quizlandia!</em>
            </Typography>
            {signinFlow && <SignIn setSigninFlow={setSigninFlow} setUid={props.setUid}/>}
            {!signinFlow && <SignUp setSigninFlow={setSigninFlow} setUid={props.setUid}/>}
            <Button variant="contained" color="secondary" style={{ marginTop: '10px' }}>
                Authenticate with Google
            </Button>
        </Container>
    );
}

export default Auth;