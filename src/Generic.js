import React from 'react'
import StarWarsCrawl from 'react-star-wars-crawl'

// Import the necessary styles, or include them another way with your build process
import 'react-star-wars-crawl/lib/index.css'
import {useNavigate} from "react-router-dom";

function Generic(){
    const navigate = useNavigate();


    //Après StarWarsCrawl navigue à /App
    if (StarWarsCrawl === 0) {
        navigate('/App');
    }

    return (
        <div>
            <StarWarsCrawl
                title="Episode IV"
                subTitle="A New Hope"
                text="It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire. During the battle, Rebel spies managed to steal secret plans to the Empire's ultimate weapon, the DEATH STAR, an armored space station with enough power to destroy an entire planet."
            />
        </div>
    )
}

export default Generic