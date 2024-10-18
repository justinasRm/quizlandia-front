import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Auth from './components/Auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import MainPage from './components/mainPage';
import Header from './components/Header';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3', // Bright Blue
        },
        secondary: {
            main: '#ff9800', // Lively Orange
        },
        success: {
            main: '#4caf50', // Vibrant Green
        },
        background: {
            default: '#f1f5f5', // Light Background
        },
    },
    typography: {
        h4: {
            fontWeight: 600,
        },
    },
});

function App() {
    const [uid, setUid] = useState(undefined);  // Tracks the user ID
    const [idToken, setIdToken] = useState(null);  // Tracks the secure token
    const [loading, setLoading] = useState(true);  // Tracks loading state

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Fetch the user's ID token
                    const token = await user.getIdToken();
                    setIdToken(token);
                    setUid(user.uid);  // Optionally store the uid for display
                    console.log('User is signed in with token:', user);
                } catch (error) {
                    console.error('Error fetching ID token:', error);
                }
            } else {
                setUid(null);
                setIdToken(null);
                console.log('No user is signed in.');
            }
            setLoading(false);  // Set loading to false after the auth check
        });

        // Cleanup the onAuthStateChanged listener when the component unmounts
        return () => unsubscribe();
    }, []);

    // Loading screen while checking authentication state
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', maxWidth: "1440px", margin: "auto" }}>
                <Router>
                    {idToken && <Header />}

                    <Routes>
                        <Route path="/" element={idToken ? <MainPage /> : <Auth setUid={setUid} />} />
                    </Routes>
                </Router>
            </div>
        </ThemeProvider>
    );
}

export default App;
