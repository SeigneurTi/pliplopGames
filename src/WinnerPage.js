import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import winnerSound from './audio/winner-sound.mp3'; // Assurez-vous d'avoir un fichier audio nommé 'winner-sound.mp3' dans le dossier 'audio'
import './styles.css';

export default function WinnerPage() {
    const navigate = useNavigate();
    const audioRef = useRef(new Audio(winnerSound));

    useEffect(() => {
        audioRef.current.play();
        audioRef.current.loop = true; // Loop the audio

        return () => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // Reset the audio to the beginning
        };
    }, []);

    const handleRestart = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset the audio to the beginning
        navigate('/app');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
            <div className="text-left text-white text-2xl font-bold mb-4">Vous avez gagne !</div>
            <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGVqc3hidmd1azRzemYyeWhwc3cyaWt5ZXNtZnJqbzFyNjZ4cnVvNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ov9jDXQIo4FP1DRHa/giphy.webp" alt="You win!" className="h-full" />
            <button onClick={handleRestart} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Recommencer ?</button>
        </div>
    );
}
