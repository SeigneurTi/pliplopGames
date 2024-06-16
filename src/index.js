import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WinnerPage from './WinnerPage';
import Introduction from './Introduction';
import LoserPage from './LoserPage'; // Import the LoserPage component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Introduction />} />
            <Route path="/app" element={<App />} />
            <Route path="/winner" element={<WinnerPage />} />
            <Route path="/loser" element={<LoserPage />} /> {/* Add this line */}
        </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals.console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
