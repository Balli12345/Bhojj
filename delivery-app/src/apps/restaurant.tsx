import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App initialView="restaurant_dashboard" />
  </React.StrictMode>
);
