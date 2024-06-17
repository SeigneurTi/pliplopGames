import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import './HyperspaceAnimation.css';
import JumpToHyperspace from './HyperspaceAnimation';
import alienImage from './images/alien-talking.gif';
import alienAudio from './audio/alien-talking.mp3'; // Assurez-vous d'avoir cet audio dans votre dossier audio

const Introduction = () => {
    const navigate = useNavigate();
    const [showButton, setShowButton] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('');
    const [displayedText, setDisplayedText] = useState('');
    const [introText, setIntroText] = useState('');
    const [showUnderscore, setShowUnderscore] = useState(false);
    const audioRef = useRef(null); // Référence pour l'audio
    const firstLine = "EarthMap";
    const secondLine = "Game";
    const fullText = firstLine + secondLine;
    const modalContent = `Bienvenue jeune terrien,\nNous avons besoin de ton aide pour cartographier les lieux.\nApparemment votre "Terre" se compose de plusieurs territoires que l'on appelle pays.\nNous avons besoin de les enregistrer dans notre base de donnees, c'est pourquoi nous vous avons choisi !\n\nInstructions: Vous devez choisir entre deux modes de jeu:\n1. Trouver le pays correspondant au nom fourni.\n2. Trouver le pays correspondant au monument fourni.\nVous devez obtenir 5 reponses correctes pour gagner.\nAttention! 5 mauvaises reponses et vous perdez.\n\nBonne chance !`;
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
                setModalText(modalContent.slice(0, index));
                index++;
                if (index > modalContent.length) {
                    clearInterval(interval);
                    setShowUnderscore(true); // Show underscore after text is fully displayed
                }
            }, 35); // Each letter appears every 0.05 seconds

            // Commencez à jouer l'audio
            if (audioRef.current) {
                audioRef.current.play();
            }

            return () => clearInterval(interval);
        }
    }, [showModal, modalContent]);

    const startHyperspace = () => {
        setPhase('hyperspace');
        const jumpInstance = new JumpToHyperspace();
        setMyJump(jumpInstance);
        setTimeout(() => {
            setShowModal(true); // Show the modal at the end of the hyperspace animation
        }, 10000); // Duration of the hyperspace animation
    };

    const handleContinue = () => {
        if (myJump) {
            myJump.cleanup(); // Ensure cleanup before navigating
        }
        setShowModal(false);
        if (audioRef.current) {
            audioRef.current.pause(); // Arrêter l'audio
            audioRef.current.currentTime = 0; // Réinitialiser l'audio
        }
        navigate('/app'); // Redirect to /app after the modal
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

    const renderModalText = () => {
        return (
            <div className="modal-text">
                {modalText.split('\n').map((line, i) => (
                    <div key={i} className="modal-line">
                        {line}
                        {i === modalText.split('\n').length - 1 && showUnderscore && <span className="blink">_</span>}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="introduction">
            <audio ref={audioRef} loop>
                <source src={alienAudio} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
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
                        <span className="modal-anim"></span>
                        <span className="modal-anim"></span>
                        <span className="modal-anim"></span>
                        <span className="modal-anim"></span>
                        <img src={alienImage} alt="Alien" className="modal-image" />
                        <div className="modal-body">
                            {renderModalText()}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={handleContinue} className="continue-button">Continuer</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Introduction;
