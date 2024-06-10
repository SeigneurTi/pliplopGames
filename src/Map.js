import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import countriesData from './countries.json';

const Map = ({ targetCountry, onCountrySelected, selectedCountry, wrongGuess, correctGuess, isBlinking, isValidated }) => {
	const [hovered, setHovered] = useState(null);

	const handleCountryClick = (e) => {
		if (!isValidated) {
			const countryName = e.target.feature.properties.ADMIN;
			onCountrySelected(countryName);
		}
	};

	const handleCountryMouseOver = (e) => {
		if (!isValidated) {
			const countryName = e.target.feature.properties.ADMIN;
			setHovered(countryName);
		}
	};

	const handleCountryMouseOut = (e) => {
		if (!isValidated) {
			setHovered(null);
		}
	};

	const style = {
		fillColor: 'white',
		weight: 0.2, // Adjusted weight to make the borders finer
		color: 'black',
	};

	const highlightStyle = {
		fillColor: 'yellow',
		weight: 1, // Adjusted weight for selected country
		color: 'black',
	};

	const hoverStyle = {
		fillColor: 'lightblue',
		weight: 1, // Adjusted weight for hovered country
		color: 'black',
	};

	const wrongGuessStyle = {
		fillColor: isBlinking ? 'red' : 'white', // Set to pure red without opacity
		weight: 1,
		color: 'black',
	};

	const correctGuessStyle = {
		fillColor: isBlinking ? 'green' : 'white', // Set to pure green without opacity
		weight: 1,
		color: 'black',
	};

	return (
		<MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
			<TileLayer
				url="https://api.maptiler.com/maps/landscape/256/{z}/{x}/{y}.png?key=A5FKOaq6mxWDrS8TC6Fd"
				attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			<GeoJSON
				data={countriesData}
				style={(feature) => {
					if (feature.properties.ADMIN === correctGuess) {
						return correctGuessStyle;
					} else if (feature.properties.ADMIN === wrongGuess) {
						return wrongGuessStyle;
					} else if (feature.properties.ADMIN === selectedCountry) {
						return highlightStyle;
					} else if (feature.properties.ADMIN === hovered) {
						return hoverStyle;
					} else {
						return style;
					}
				}}
				onEachFeature={(feature, layer) => {
					layer.on({
						click: handleCountryClick,
						mouseover: handleCountryMouseOver,
						mouseout: handleCountryMouseOut,
					});
					if (isValidated) {
						layer.off('click');
						layer.off('mouseover');
						layer.off('mouseout');
					}
				}}
			/>
		</MapContainer>
	);
};

export default Map;
