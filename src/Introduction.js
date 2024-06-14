import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Introduction.css';

const Introduction = () => {
    const navigate = useNavigate();
    const [displayedText, setDisplayedText] = useState('');
    const firstLine = "EarthMap";
    const secondLine = "Game";
    const fullText = firstLine + secondLine;

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + fullText[index]);
            index++;
            if (index === fullText.length) {
                clearInterval(interval);
                setTimeout(() => {
                    navigate('/App');
                }, 4000); // Wait 4 seconds before navigating to the main application
            }
        }, 150); // Each letter appears every 0.15 seconds

        return () => clearInterval(interval);
    }, [fullText, navigate]);

    const renderText = () => {
        return (
            <div className="intro-container">
                <div className="line">{firstLine.split('').map((char, index) => (
                    <span key={index} className="letter" style={{ animationDelay: `${index * 0.15}s` }}>{char}</span>
                ))}</div>
                <div className="line">{secondLine.split('').map((char, index) => (
                    <span key={index + firstLine.length} className="letter" style={{ animationDelay: `${(index + firstLine.length) * 0.15}s` }}>{char}</span>
                ))}</div>
            </div>
        );
    };

    return (
        <div className="introduction">
            {renderText()}
        </div>
    );
};

export default Introduction;
