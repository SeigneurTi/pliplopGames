import React, { useState, useEffect, useCallback } from 'react';
import Map from './Map';
import StarryBackground from './StarryBackground';
import translations from './translations.json';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';
import './HyperspaceAnimation.css';
import './HyperspaceAnimation.js'; // Import the new JS
import monuments from './monuments.json';

function App() {
  const [targetCountry, setTargetCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [result, setResult] = useState("");
  const [wrongGuess, setWrongGuess] = useState(null);
  const [correctGuess, setCorrectGuess] = useState(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [correctScore, setCorrectScore] = useState(0);
  const [wrongScore, setWrongScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [introText, setIntroText] = useState('');
  const [showUnderscore, setShowUnderscore] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const [countryJokers, setCountryJokers] = useState(5);
  const [monumentJokers, setMonumentJokers] = useState(2);
  const navigate = useNavigate();
  const location = useLocation();
  const gameMode = new URLSearchParams(location.search).get('mode');
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [visitedMonuments, setVisitedMonuments] = useState([]);

  useEffect(() => {
    if (gameMode) {
      if (gameMode === 'country') {
        fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
          .then(response => response.json())
          .then(data => {
            const countries = data.features.map(feature => feature.properties.name);
            setTargetCountry(getRandomTarget(countries, visitedCountries));
          });
      } else if (gameMode === 'monument') {
        const monument = getRandomTarget(monuments, visitedMonuments);
        setTargetCountry(monument.country);
      }
    }
  }, [gameMode]);

  const getRandomTarget = (list, visited) => {
    const unvisited = list.filter(item => !visited.includes(item));
    const target = unvisited[Math.floor(Math.random() * unvisited.length)];
    setVisitedCountries(prev => gameMode === 'country' ? [...prev, target] : prev);
    setVisitedMonuments(prev => gameMode === 'monument' ? [...prev, target] : prev);
    return target;
  };

  useEffect(() => {
    let blinkInterval;
    if (wrongGuess || correctGuess) {
      setIsBlinking(true);
      blinkInterval = setInterval(() => {
        setIsBlinking(prev => !prev);
      }, 500);
    } else {
      setIsBlinking(false);
    }

    return () => clearInterval(blinkInterval);
  }, [wrongGuess, correctGuess]);

  const handleCountrySelected = useCallback((countryName) => {
    if (!isValidated) {
      setSelectedCountry(countryName);
    }
  }, [isValidated]);

  const validateSelection = () => {
    if (isValidated || !selectedCountry) return;

    setIsValidated(true);

    if (selectedCountry === targetCountry) {
      setResult('Correct! Bien joue.');
      setCorrectScore(correctScore + 1);
      setCorrectGuess(targetCountry);
      if (correctScore + 1 === 5) {
        navigate('/winner');
      }
    } else {
      if (gameMode === 'monument') {
        setResult(`Incorrect. Vous avez choisi ${translations[selectedCountry] || selectedCountry}. C'etait ${translations[targetCountry] || targetCountry}.`);
      } else {
        setResult(`Incorrect. Vous avez choisi ${translations[selectedCountry] || selectedCountry}.`);
      }
      setWrongScore(wrongScore + 1);
      if (wrongScore + 1 === 5) {
        navigate('/loser');
      }
      setWrongGuess(selectedCountry);
    }
  };

  const nextCountry = () => {
    if (!selectedCountry && !isValidated) {
      if (gameMode === 'country' && countryJokers > 0) {
        setCountryJokers(countryJokers - 1);
      } else if (gameMode === 'monument' && monumentJokers > 0) {
        setMonumentJokers(monumentJokers - 1);
      } else {
        return;
      }
    }

    if (gameMode === 'country') {
      fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
        .then(response => response.json())
        .then(data => {
          const countries = data.features.map(feature => feature.properties.name);
          setTargetCountry(getRandomTarget(countries, visitedCountries));
        });
    } else if (gameMode === 'monument') {
      const monument = getRandomTarget(monuments, visitedMonuments);
      setTargetCountry(monument.country);
    }
    setSelectedCountry(null);
    setWrongGuess(null);
    setCorrectGuess(null);
    setIsValidated(false);
    setResult("");
  };

  const getCountryNameInFrench = (countryName) => {
    return translations[countryName] || countryName;
  };

  const handlePlay = () => {
    setShowChoice(true);
  };

  const handleGameChoice = (gameMode) => {
    setIsPlaying(true);
    setRotation([-10, 0]);
    setShowChoice(false);
    navigate(`/app?mode=${gameMode}`);
  };

  useEffect(() => {
    const fullText = "Earth 841_\nSystem 451-b";
    let index = 0;
    const interval = setInterval(() => {
      setIntroText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setShowUnderscore(true);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const renderQuestion = () => {
    if (gameMode === 'country') {
      return `Trouve le bon pays: ${getCountryNameInFrench(targetCountry)}`;
    } else if (gameMode === 'monument') {
      const targetMonument = monuments.find(monument => monument.country === targetCountry);
      return `A quel pays appartient ce monument: ${targetMonument ? targetMonument.monument : ''}`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 relative">
      <StarryBackground rotation={rotation} />
      <div className="w-3/4 h-3/4 mb-4 flex justify-center items-center">
        <Map
          targetCountry={targetCountry}
          onCountrySelected={handleCountrySelected}
          selectedCountry={selectedCountry}
          wrongGuess={wrongGuess}
          correctGuess={correctGuess}
          isBlinking={isBlinking}
          isValidated={isValidated}
          setRotation={setRotation}
          isPlaying={isPlaying}
        />
      </div>
      {!isPlaying && !showChoice && (
        <>
          <div className="text-animation">
            {introText.split('\n').map((line, index) => (
              <div key={index} className="text-line whereist-font">
                {line}
                {index === introText.split('\n').length - 1 && showUnderscore && <span className="blink">_</span>}
              </div>
            ))}
          </div>
          <button className="play-button" onClick={handlePlay}>
            Jouer
          </button>
        </>
      )}
      {showChoice && (
        <div className="choice-modal">
          <div className="choice-content">
            <button onClick={() => handleGameChoice('country')} className="choice-button">Trouver le pays</button>
            <button onClick={() => handleGameChoice('monument')} className="choice-button">Trouver le monument</button>
          </div>
        </div>
      )}
      {isPlaying && (
        <>
          <div className="absolute top-4 left-4 text-white">
            <h1 className="text-2xl font-bold mb-4">{gameMode === 'country' ? 'Trouver le Pays' : 'Trouver le Monument'}</h1>
            <div className="text-lg mb-2">{renderQuestion()}</div>
          </div>
          <div className="absolute top-4 right-4 text-white">
            <div className="text-lg mb-2">Score correct: {correctScore}</div>
            <div className="text-lg mb-2">Score incorrect: {wrongScore}</div>
            {gameMode === 'country' ? (
              <div className="text-lg mb-2">Jokers: {countryJokers}</div>
            ) : (
              <div className="text-lg mb-2">Jokers: {monumentJokers}</div>
            )}
          </div>
          <button className={`bg-blue-500 text-white px-4 py-2 rounded mb-2 ${isValidated}`} onClick={validateSelection}
            disabled={isValidated || !selectedCountry}>Valider
          </button>
          <button className={`bg-gray-500 text-white px-4 py-2 rounded ${isValidated && 'blinking'}`} onClick={nextCountry}>Suivant</button>
          <p className="mt-4 text-white">{result}</p>
        </>
      )}
    </div>
  );
}

export default App;
