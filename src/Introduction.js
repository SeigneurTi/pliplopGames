import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Introduction.css';
import './HyperspaceAnimation.css'; // Import the new CSS
import './HyperspaceAnimation.js'; // Import the new JS

const Introduction = () => {
    const navigate = useNavigate();
    const [displayedText, setDisplayedText] = useState('');
    const firstLine = "EarthMap";
    const secondLine = "Game";
    const fullText = firstLine + secondLine;
    const [phase, setPhase] = useState('intro');

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + fullText[index]);
            index++;
            if (index === fullText.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setPhase('hyperspace');
                }, 4000); // Wait 4 seconds before starting the hyperspace animation
            }
        }, 150); // Each letter appears every 0.15 seconds

        return () => clearInterval(interval);
    }, [fullText]);

    useEffect(() => {
        if (phase === 'hyperspace') {
            const myJump = new window.JumpToHyperspace();
            setTimeout(() => {
                setPhase('navigate');
                document.body.removeChild(myJump.canvas);
                myJump.renderer.domElement.remove(); // Remove the Three.js renderer
            }, 10000); // Duration of the hyperspace animation
        }
    }, [phase]);

    useEffect(() => {
        if (phase === 'navigate') {
            navigate('/app');
        }
    }, [phase, navigate]);

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
            {phase === 'intro' && renderText()}
            {phase === 'hyperspace' && <div id="hyperspace-animation"></div>}
        </div>
    );
};

export default Introduction;
