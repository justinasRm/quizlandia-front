import { Button } from '@mui/material';
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';

const MainPage = () => {
    console.log('MainPage');

    const logOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log('User signed out');
            // Optionally, redirect the user to the login page or show a message
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    };

    return (
        <div>
            <h1>Welcome to Quizlandia!</h1>
            <p>Your ultimate quiz destination.</p>
            <Button variant="contained" color="primary" onClick={()=>logOut()}>Log out</Button>
        </div>
    );
};

export default MainPage;