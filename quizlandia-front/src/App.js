import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Auth from './components/Auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import MainPage from './components/mainPage';
import QuizPage from './components/quizPage';
import Header from './components/Header';
import SearchPage from './components/searchPage';
import SolveQuiz from './components/solveQuiz';
import { useDispatch, useSelector } from 'react-redux';

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

    const authPause = useSelector((state) => state.auth.authPause);
    const authPauseRef = useRef(authPause);

    useEffect(() => {
        authPauseRef.current = authPause;
    }, [authPause])

    const authStateChangeFunc = async (user) => {
            if (authPauseRef.current) return;
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
        }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChangeFunc);

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh'}}>
                <Router>
                    {idToken && <Header />}

                    <div style={{ maxWidth: "90%", margin: "auto" }}>
                        <Routes>
                            <Route path="/" element={idToken ? <MainPage /> : <Auth setUid={setUid} />} />
                            <Route path="/quiz-creation" element={idToken ? <QuizPage /> : <Auth setUid={setUid} />} />
                            <Route path="/search-quizzes" element={idToken ? <SearchPage /> : <Auth setUid={setUid} />} />
                            <Route path="/quiz/:id" element={idToken ? <SolveQuiz /> : <Auth setUid={setUid} />} />
                        </Routes>
                    </div>
                </Router>
            </div>
        </ThemeProvider>
    );
}

export default App;
