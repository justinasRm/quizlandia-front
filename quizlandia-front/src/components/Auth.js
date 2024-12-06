import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import SignIn from './SignIn';
import SignUp from './SignUp';
import GoogleAuth from './GoogleAuth';
function Auth(props) {
    const [signinFlow, setSigninFlow] = useState(true);

    return (
        <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to <em style={{ color: 'blue' }}>Quizlandia!</em>
            </Typography>
            {signinFlow && <SignIn setSigninFlow={setSigninFlow} setUid={props.setUid} />}
            {!signinFlow && <SignUp setSigninFlow={setSigninFlow} setUid={props.setUid} />}
            <GoogleAuth setSigninFlow={setSigninFlow} setUid={props.setUid} />
        </Container>
    );
}

export default Auth;