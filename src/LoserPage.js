import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import alienLoseImage from './images/alien-lose.gif';
import loseSound from './audio/lose-sound.mp3'; // Assurez-vous que ce chemin est correct

export default function LoserPage() {
    const audioRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(error => {
                console.error("Autoplay was prevented:", error);
            });
        }
    }, []);

    const handleRestart = () => {
        navigate('/app');
    };

    return (
        <div className="loser-page">
            <div className="loser-content">
                <div className="loser-text">
                    <h1>Vous avez perdu</h1>
                </div>
                <img src={alienLoseImage} alt="You lose" className="loser-image" />
                <div className="loser-button">
                    <button onClick={handleRestart}>Recommencer ?</button>
                </div>
            </div>
            <audio ref={audioRef} src={loseSound} loop autoPlay />
        </div>
    );
}
