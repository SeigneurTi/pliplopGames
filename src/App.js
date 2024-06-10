import React, { useState, useEffect } from 'react';
import Map from './Map';
import countriesData from './countries.json';
import translations from './translations.json';

const countries = countriesData.features.map(feature => feature.properties.ADMIN);

function App() {
  const [targetCountry, setTargetCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [result, setResult] = useState("");
  const [wrongGuess, setWrongGuess] = useState(null);
  const [correctGuess, setCorrectGuess] = useState(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    setTargetCountry(countries[Math.floor(Math.random() * countries.length)]);
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

  const handleCountrySelected = (countryName) => {
    if (!isValidated) {
      setSelectedCountry(countryName);
    }
  };

  const validateSelection = () => {
    if (isValidated) return;

    setIsValidated(true);

    if (selectedCountry === targetCountry) {
      setResult('Correct! Well done.');
      setCorrectGuess(targetCountry);
    } else {
      setResult(`Incorrect. You selected ${selectedCountry}.`);
      setWrongGuess(targetCountry);
    }
  };

  const nextCountry = () => {
    setTargetCountry(countries[Math.floor(Math.random() * countries.length)]);
    setSelectedCountry(null);
    setWrongGuess(null);
    setCorrectGuess(null);
    setIsValidated(false);
    setResult("");
  };

  const getCountryNameInFrench = (countryName) => {
    return translations[countryName] || countryName;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Find the Country</h1>
      <div className="w-3/4 h-3/4 mb-4 flex justify-center items-center"> {/* Ajustez la hauteur ici */}
        <Map targetCountry={targetCountry} onCountrySelected={handleCountrySelected} selectedCountry={selectedCountry} wrongGuess={wrongGuess} correctGuess={correctGuess} isBlinking={isBlinking} isValidated={isValidated} />
      </div>
      <div className="text-lg mb-2">Find the Country: <span className="font-bold">{getCountryNameInFrench(targetCountry)}</span></div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2" onClick={validateSelection} disabled={isValidated}>Validate</button>
      <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={nextCountry}>Next Country</button>
      <p className="mt-4">{result}</p>
    </div>
  );
}

export default App;
