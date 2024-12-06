import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Auth from './components/Auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import MainPage from './components/mainPage';
import QuizPage from './components/quizPage';
import Header from './components/Header';
import SearchPage from './components/searchPage';
import Statistics from './components/statistics';
import SolveQuiz from './components/solveQuiz';
import UserQuizzes from './components/userQuizPage';
import { useDispatch, useSelector } from 'react-redux';
import { setUid as reduxSetUid, setUserType } from './authSlice';
import { userAccountType } from './functions/userAccountType';

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

    const accountType = useSelector((state) => state.auth.userType);
    console.log("account type: " + accountType);

    const authPause = useSelector((state) => state.auth.authPause);
    const authPauseRef = useRef(authPause);

    const dispatch = useDispatch();

    const uidFromRedux = useSelector((state) => state.auth.uid);

    useEffect(() => {
        console.log('UID from Redux changed:', uidFromRedux);
    }, [uidFromRedux]);

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
                const type = await userAccountType(user.uid);
                if (!type) {
                    console.error('Error fetching user type');

                }
                dispatch(reduxSetUid(user.uid));
                dispatch(setUserType(type));
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
            <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
                <Router>
                    {idToken && <Header accountType={accountType} />}

                    <div style={{ maxWidth: "90%", margin: "auto" }}>
                        <Routes>
                            <Route path="/" element={!idToken ? <Auth setUid={setUid} uid={uid} /> : <MainPage accountType={accountType} />} />
                            <Route path="/quiz-creation" element={!idToken ? <Auth setUid={setUid} uid={uid} /> : <QuizPage />} />
                            <Route path="/search-quizzes" element={!idToken ? <Auth setUid={setUid} uid={uid} /> : <SearchPage />} />
                            <Route path="/statistics" element={!idToken ? <Auth setUid={setUid} uid={uid} /> : <Statistics />} />
                            <Route path="/quiz/:id" element={!idToken ? <Auth setUid={setUid} uid={uid} /> : <SolveQuiz />} />
                            <Route path="/my-quizzes" element={!idToken ? <Auth setUid={setUid} uid={uid} /> : <UserQuizzes userId={uidFromRedux} />} />
                            <Route path="/statistics" element={idToken ? <SearchPage /> : <Auth setUid={setUid} uid={uid} />} />
                            <Route path="/quiz/:id" element={idToken ? <SolveQuiz /> : <Auth setUid={setUid} uid={uid} />} />
                        </Routes>
                    </div>
                </Router>
            </div>
        </ThemeProvider>
    );
}

export default App;
