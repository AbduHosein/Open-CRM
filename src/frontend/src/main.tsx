import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/notifications/styles.css';
import './styles/global.css';
import '@mantine/core/styles.css';
import App from './App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext.tsx';


const theme = createTheme({
  primaryColor: 'jetBlack',
  colors: {
    lavender: ['#eae8ff', '#eae8ff', '#eae8ff', '#eae8ff', '#eae8ff', '#eae8ff', '#eae8ff', '#eae8ff', '#eae8ff', '#eae8ff'],
    alabasterGrey: ['#d8d5db', '#d8d5db', '#d8d5db', '#d8d5db', '#d8d5db', '#d8d5db', '#d8d5db', '#d8d5db', '#d8d5db', '#d8d5db'],
    paleSlate: ['#adacb5', '#adacb5', '#adacb5', '#adacb5', '#adacb5', '#adacb5', '#adacb5', '#adacb5', '#adacb5', '#adacb5'],
    jetBlack: ['#2d3142', '#2d3142', '#2d3142', '#2d3142', '#2d3142', '#2d3142', '#2d3142', '#2d3142', '#2d3142', '#2d3142'],
    icyBlue: ['#b0d7ff', '#b0d7ff', '#b0d7ff', '#b0d7ff', '#b0d7ff', '#b0d7ff', '#b0d7ff', '#b0d7ff', '#b0d7ff', '#b0d7ff'],
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </MantineProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);