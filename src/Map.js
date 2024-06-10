import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import countriesData from './countries.json'; // Assure-toi que ce fichier existe

const Map = ({ targetCountry, onCountrySelected, selectedCountry }) => {
	const onEachCountry = (country, layer) => {
		const countryName = country.properties.ADMIN;

		layer.on({
			mouseover: (e) => {
				e.target.setStyle({
					weight: 2,
					color: '#666',
					fillOpacity: 0.7
				});
			},
			mouseout: (e) => {
				if (selectedCountry !== countryName) {
					e.target.setStyle({
						weight: 1,
						color: '#3388ff',
						fillOpacity: 0.2
					});
				}
			},
			click: (e) => {
				onCountrySelected(countryName);
				e.target.setStyle({
					weight: 2,
					color: '#ff7800',
					fillOpacity: 0.7
				});
			}
		});

		if (selectedCountry === countryName) {
			layer.setStyle({
				weight: 2,
				color: '#ff7800',
				fillOpacity: 0.7
			});
		} else {
			layer.setStyle({
				weight: 1,
				color: '#3388ff',
				fillOpacity: 0.2
			});
		}
	};

	return (
		<MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			<GeoJSON data={countriesData} onEachFeature={onEachCountry} />
		</MapContainer>
	);
};

export default Map;
