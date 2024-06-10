import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import countriesData from './countries.json';

const Map = ({ targetCountry, onCountrySelected, selectedCountry }) => {
	const [hovered, setHovered] = useState(null);
	const [selected, setSelected] = useState(null);

	const handleCountryClick = (e) => {
		const countryName = e.target.feature.properties.ADMIN;
		onCountrySelected(countryName);
		setSelected(countryName);
		setHovered(null); // Clear hover when a country is selected
	};

	const handleCountryMouseOver = (e) => {
		const countryName = e.target.feature.properties.ADMIN;
		if (selected !== countryName) {
			setHovered(countryName);
		}
	};

	const handleCountryMouseOut = (e) => {
		setHovered(null);
	};

	const style = {
		fillColor: 'white',
		weight: 0.1, // Adjusted weight to make the borders finer
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

	return (
		<MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
			<TileLayer
				url="https://api.maptiler.com/maps/landscape/256/{z}/{x}/{y}.png?key=A5FKOaq6mxWDrS8TC6Fd"
				attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			<GeoJSON
				data={countriesData}
				style={(feature) => {
					if (feature.properties.ADMIN === selected) {
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
				}}
			/>
		</MapContainer>
	);
};

export default Map;
