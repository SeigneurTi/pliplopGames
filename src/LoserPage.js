import React from 'react';
import './styles.css';

export default function LoserPage() {
    return (
        <div className="loser-page">
            <iframe
                src="https://giphy.com/embed/k4EpQLLFV6byo"
                width="320"
                height="480"
                frameBorder="0"
                className="giphy-embed"
                allowFullScreen
            ></iframe>
            <audio autoPlay loop>
                <source src="https://www.youtube.com/watch?v=sWtBE0T6eD8" type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}
