import React, { useEffect } from 'react';
import alienlose from './soundtracks/Alien_lose.mp3';
import useSound from "use-sound";

export default function LoserPage() {
    const [play, { stop }] = useSound(alienlose, { volume: 1 });

    useEffect(() => {
        play();
        return () => {
            stop();
        };
    }, [play, stop]);

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">You Lose!</h1>
            <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmR2NjJudGU2d2l3d3VibGk5c3l1angwaW9jaGIwaDQ0MWVwdTJ4bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/k4EpQLLFV6byo/giphy.webp" alt="You lose!" />
        </div>
    );
}
