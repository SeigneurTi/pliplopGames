import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import Map from './Map';
import countriesData from './countries.json';
import translations from './translations.json';

const countries = countriesData.features.map(feature => feature.properties.ADMIN);

export default function App() {
    const [targetCountry, setTargetCountry] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [result, setResult] = useState("");
    const [correctScore, setCorrectScore] = useState(0);
    const [wrongScore, setWrongScore] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setTargetCountry(countries[Math.floor(Math.random() * countries.length)]);
    }, []);

    const handleCountrySelected = (countryName) => {
        setSelectedCountry(countryName);
    };

    const validateSelection = () => {
        if (selectedCountry === targetCountry) {
            setResult('Correct! Well done.');
            setCorrectScore(correctScore + 1);
        } else {
            setResult(`Incorrect. You selected ${selectedCountry}.`);
            setWrongScore(wrongScore + 1);
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
            <div className="text-lg mb-2">
                Trouve le bon pays: <span className="font-bold">{translations[targetCountry]}</span>
            </div>
            <div className="text-lg mb-2">Nombre de bons Score : {correctScore}</div>
            <div className="text-lg mb-2">Nombre de mauvais score : {wrongScore}</div>
            {correctScore === 1 &&  navigate("/winner")}>
            <div className="w-full h-96">
                <Map targetCountry={targetCountry} onCountrySelected={handleCountrySelected} selectedCountry={selectedCountry} />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={validateSelection}>Valider</button>
            <p className="mt-4">{result}</p>
        </div>
    );
}
