import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Introduction.css';
import './HyperspaceAnimation.css';
import JumpToHyperspace from './HyperspaceAnimation';
import alienImage from './images/alien-talking.gif';

const Introduction = () => {
    const navigate = useNavigate();
    const [displayedText, setDisplayedText] = useState('');
    const [showButton, setShowButton] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const firstLine = "EarthMap";
    const secondLine = "Game";
    const fullText = firstLine + secondLine;
    const [phase, setPhase] = useState('intro');
    const [myJump, setMyJump] = useState(null);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + fullText[index]);
            index++;
            if (index === fullText.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setShowButton(true);
                }, 1000); // Show button 1 second after text is fully displayed
            }
        }, 150); // Each letter appears every 0.15 seconds

        return () => clearInterval(interval);
    }, [fullText]);

    const startHyperspace = () => {
        setPhase('hyperspace');
        const jumpInstance = new JumpToHyperspace();
        setMyJump(jumpInstance);
        setTimeout(() => {
            setShowModal(true); // Show the modal at the end of the hyperspace animation
            // Do not call cleanup here to keep the Earth visible
        }, 10000); // Duration of the hyperspace animation
    };

    const handleContinue = () => {
        if (myJump) {
            myJump.cleanup(); // Ensure cleanup before navigating
        }
        setPhase('navigate');
        setShowModal(false);
        navigate('/app');
    };

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
            {phase === 'intro' && (
                <>
                    {renderText()}
                    {showButton && (
                        <button onClick={startHyperspace} className="start-button">C'est parti !</button>
                    )}
                </>
            )}
            {phase === 'hyperspace' && <div id="hyperspace-animation"></div>}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <img src={alienImage} alt="Alien" className="modal-image" />
                        </div>
                        <div className="modal-body">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleContinue} className="continue-button">Continuer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Introduction;
