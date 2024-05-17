import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import App from './App.jsx'; 

const rootElement = document.getElementById('root');
if (rootElement) {
    // Pass the valid HTML element
    const root = createRoot(rootElement);
    root.render(<App />);
} else {
    console.error("Root element not found!");
}
