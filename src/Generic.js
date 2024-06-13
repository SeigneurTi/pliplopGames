import React, { useEffect } from 'react';
import StarWarsCrawl from 'react-star-wars-crawl';
import 'react-star-wars-crawl/lib/index.css';
import { useNavigate } from 'react-router-dom';

function Generic() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/App');
        }, 30000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div>
            <StarWarsCrawl
                title="Episode IV"
                subTitle="A New Hope"
                text="It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire. During the battle, Rebel spies managed to steal secret plans to the Empire's ultimate weapon, the DEATH STAR, an armored space station with enough power to destroy an entire planet."
            />
        </div>
    );
}

export default Generic;
