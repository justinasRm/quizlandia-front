import React, { useEffect } from 'react';
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
  const [uid, setUid ] = React.useState(undefined);

  useEffect(() => {
    // check local storage for uid
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in:', user);
        setUid(user.uid);
      } else {
        setUid(null);
        console.log('No user is signed in.');
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', maxWidth: "1440px",  margin: "auto" }}>

        <Router>

          {uid && <Header />}

          <Routes>

            <Route path="/" element={uid ? <MainPage /> : <> {uid === null ? <Auth setUid={setUid} /> : 'Loading...'} </>} />

          </Routes>

        </Router>

      </div>
    </ThemeProvider>
  );
}

export default App;