import React, { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Auth from './components/Auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import MainPage from './components/mainPage';

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
      <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        {uid ? <MainPage /> :
          <>
            {uid === null ? <Auth setUid={setUid} /> : 'Loading...'}
          </>
          }
      </div>
    </ThemeProvider>
  );
}

export default App;