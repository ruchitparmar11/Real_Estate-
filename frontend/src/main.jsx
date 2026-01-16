import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import 'leaflet/dist/leaflet.css';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
