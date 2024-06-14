import React, { useState, useEffect, useCallback } from 'react';
import Map from './Map';
import StarryBackground from './StarryBackground';
import translations from './translations.json';
import { useNavigate } from 'react-router-dom';
import './styles.css';

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
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(response => response.json())
      .then(data => {
        const countries = data.features.map(feature => feature.properties.name);
        setTargetCountry(countries[Math.floor(Math.random() * countries.length)]);
      });
  }, []);

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
    if (isValidated) return;

    setIsValidated(true);

    if (selectedCountry === targetCountry) {
      setResult('Correct! Well done.');
      setCorrectScore(correctScore + 1);
      setCorrectGuess(targetCountry);
      if (correctScore + 1 === 5) {
        navigate('/winner');
      }
    } else {
      setResult(`Incorrect. You selected ${selectedCountry}.`);
      setWrongScore(wrongScore + 1);
      setWrongGuess(selectedCountry);
    }
  };

  const nextCountry = () => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(response => response.json())
      .then(data => {
        const countries = data.features.map(feature => feature.properties.name);
        setTargetCountry(countries[Math.floor(Math.random() * countries.length)]);
      });
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
    setIsPlaying(true);
    setRotation([-10, 0]);
  };

  useEffect(() => {
    const fullText = "Earth 841_\nSystem 451-b";
    let index = 0;
    const interval = setInterval(() => {
      setIntroText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setShowUnderscore(true);  // Show blinking underscore at the end
      }
    }, 150); // Adjust the speed here
    return () => clearInterval(interval);
  }, []);

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
      {!isPlaying && (
        <>
          <div className="text-animation">
            {introText.split('\n').map((line, index) => (
              <div key={index} className="text-line">
                {line}
                {index === introText.split('\n').length - 1 && showUnderscore && <span className="blink">_</span>}
              </div>
            ))}
          </div>
          <button className="play-button" onClick={handlePlay}>
            Play
          </button>
        </>
      )}
      {isPlaying && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-white">Find the Country</h1>
          <div className="text-lg mb-2 text-white">Trouve le bon pays: <span className="font-bold">{getCountryNameInFrench(targetCountry)}</span></div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2" onClick={validateSelection}
            disabled={isValidated}>Validate
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={nextCountry}>Next Country</button>
          <p className="mt-4 text-white">{result}</p>
          <div className="text-lg mb-2 text-white">Correct Score: {correctScore}</div>
          <div className="text-lg mb-2 text-white">Wrong Score: {wrongScore}</div>
        </>
      )}
    </div>
  );
}

export default App;
