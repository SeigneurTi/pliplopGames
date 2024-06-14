import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Generic = () => {
    const navigate = useNavigate();
    const [showContinue, setShowContinue] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContinue(true);
        }, 4000); // Show continue button after the animation

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4 bg-black relative">
            <div className="animation-container">
                <h1 className="text-6xl font-bold text-white animate-letters">EarthMap</h1>
                <h2 className="text-6xl font-bold text-white animate-letters">Game</h2>
            </div>
            <p className="text-xl text-white mt-4">A new adventure awaits...</p>
            {showContinue && (
                <button
                    className="mt-8 bg-green-500 text-white px-8 py-4 rounded text-2xl"
                    onClick={() => navigate('/App')}
                >
                    Continue
                </button>
            )}
        </div>
    );
};

export default Generic;
