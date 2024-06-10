import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import countriesData from './countries.json';
import translations from './translations.json';

const Map = ({ targetCountry, onCountrySelected, selectedCountry }) => {
	const [selected, setSelected] = useState(null);

	const handleCountryClick = (e) => {
		const countryName = e.target.feature.properties.ADMIN;
		onCountrySelected(countryName);
		setSelected(countryName);
	}

	const style = {
		fillColor: 'white',
		weight: 1,
		color: 'black',

	};

	const highlightStyle = {
		fillColor: 'yellow',
		weight: 2,
		color: 'black',
	};

	return (
		<MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<GeoJSON
				data={countriesData}
				style={feature => feature.properties.ADMIN === selected ? highlightStyle : style}
				onEachFeature={(feature, layer) => {
					layer.on({
						click: handleCountryClick
					});
				}}
			/>
		</MapContainer>
	);

};

export default Map;
