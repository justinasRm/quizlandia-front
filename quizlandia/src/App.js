import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Auth from './components/Auth';

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <Auth />
      </div>
    </ThemeProvider>
  );
}

export default App;