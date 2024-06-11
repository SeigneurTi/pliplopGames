import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import countriesData from './countries.json';
import './styles.css'; // Assurez-vous d'importer votre CSS

const Map = ({ targetCountry, onCountrySelected, selectedCountry, wrongGuess, correctGuess, isBlinking, isValidated }) => {
	const svgRef = useRef();

	useEffect(() => {
		const width = 980; // Ajusté pour être légèrement plus petit que le conteneur
		const height = 580; // Ajusté pour être légèrement plus petit que le conteneur

		const svg = d3.select(svgRef.current)
			.attr("width", width)
			.attr("height", height);

		const projection = d3.geoMercator().scale(150).translate([width / 2, height / 1.5]);
		const path = d3.geoPath().projection(projection);

		svg.selectAll("*").remove(); // Clear previous drawings

		const g = svg.append("g");

		g.selectAll("path")
			.data(countriesData.features)
			.enter()
			.append("path")
			.attr("d", path)
			.attr("fill", d => getFillColor(d.properties.ADMIN))
			.attr("stroke", "black")
			.attr("stroke-width", 0.5)
			.on("click", (event, d) => {
				if (!isValidated) {
					onCountrySelected(d.properties.ADMIN);
				}
			})
			.on("mouseover", (event, d) => {
				if (!isValidated) {
					d3.select(event.target).attr("fill", "lightblue");
				}
			})
			.on("mouseout", (event, d) => {
				if (!isValidated) {
					d3.select(event.target).attr("fill", getFillColor(d.properties.ADMIN));
				}
			});

		const zoom = d3.zoom()
			.scaleExtent([1, 8])
			.on("zoom", (event) => {
				g.attr("transform", event.transform);
			});

		svg.call(zoom);

		// Ajouter un cercle autour du pays correct après une mauvaise réponse
		if (wrongGuess && targetCountry) {
			const targetFeature = countriesData.features.find(
				feature => feature.properties.ADMIN === targetCountry
			);

			if (targetFeature) {
				const [[x0, y0], [x1, y1]] = path.bounds(targetFeature);
				const x = (x0 + x1) / 2;
				const y = (y0 + y1) / 2;
				const radius = Math.max((x1 - x0) / 2, (y1 - y0) / 2);

				svg.append("circle")
					.attr("cx", x)
					.attr("cy", y)
					.attr("r", radius + 10)
					.attr("stroke", "red")
					.attr("stroke-width", 2)
					.attr("fill", "none");
			}
		}
	}, [targetCountry, selectedCountry, wrongGuess, correctGuess, isBlinking, isValidated]);

	const getFillColor = (countryName) => {
		if (correctGuess === countryName) {
			return isBlinking ? 'green' : 'white';
		} else if (wrongGuess === countryName) {
			return isBlinking ? 'red' : 'white';
		} else if (selectedCountry === countryName) {
			return 'yellow';
		} else {
			return 'white';
		}
	};

	return (
		<div className="electric-border">
			<svg ref={svgRef}></svg>
		</div>
	);
};

export default Map;
