import React, { useState } from 'react';
import Map from './Map';
import countriesData from './countries.json'; // Assure-toi que ce fichier existe

const countries = countriesData.features.map(feature => feature.properties.ADMIN);

function App() {
  const [targetCountry, setTargetCountry] = useState(countries[Math.floor(Math.random() * countries.length)]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [result, setResult] = useState("");

  const handleCountrySelected = (countryName) => {
    setSelectedCountry(countryName);
  };

  const validateSelection = () => {
    if (selectedCountry === targetCountry) {
      setResult('Correct! Well done.');
    } else {
      setResult(`Incorrect. You selected ${selectedCountry}.`);
    }
    setTimeout(() => {
      setTargetCountry(countries[Math.floor(Math.random() * countries.length)]);
      setSelectedCountry(null);
      setResult("");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Find the Country</h1>
      <div className="w-3/4 h-1/2 mb-4">
        <Map targetCountry={targetCountry} onCountrySelected={handleCountrySelected} selectedCountry={selectedCountry} />
      </div>
      <div className="text-lg mb-2">Find the Country: <span className="font-bold">{targetCountry}</span></div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={validateSelection}>Validate</button>
      <p className="mt-4">{result}</p>
    </div>
  );
}

export default App;
