import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import App from './App';
import './index.css';

const configuredApiUrl = process.env.REACT_APP_API_URL;
const autoDetectedApiUrl = `${window.location.protocol}//${window.location.hostname}:5000`;

// Prefer explicit backend URL only when provided; otherwise use current host on port 5000.
axios.defaults.baseURL = configuredApiUrl || autoDetectedApiUrl;

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);