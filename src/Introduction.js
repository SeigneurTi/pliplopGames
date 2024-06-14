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
    const [modalText, setModalText] = useState('');
    const [showUnderscore, setShowUnderscore] = useState(false);
    const firstLine = "EarthMap";
    const secondLine = "Game";
    const fullText = firstLine + secondLine;
    const modalContent = `Bienvenue Jeune Terrien,\nNous avons besoin de ton aide pour cartographier les lieux.\nApparemment votre planète est constitué de plusieurs territoires appelés PAYS.\nNous avons besoin de les répertorier, c'est pourquoi nous vous avons choisi !\n\nInstructions: Le nom d'un pays sera donné, vous devez cliquer sur le territoire correspondant.\n\nBonne chance !`;
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

    useEffect(() => {
        if (showModal) {
            let index = 0;
            const interval = setInterval(() => {
                setModalText((prev) => prev + modalContent[index]);
                index++;
                if (index === modalContent.length) {
                    clearInterval(interval);
                    setShowUnderscore(false); // Stop the underscore at the end
                } else {
                    setShowUnderscore(true); // Show the underscore during typing
                }
            }, 50); // Each letter appears every 0.05 seconds

            return () => clearInterval(interval);
        }
    }, [showModal, modalContent]);

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
                            <pre className="modal-text">
                                {modalText}
                                {showUnderscore && <span className="blinking-underscore">_</span>}
                            </pre>
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
