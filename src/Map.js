import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import countriesData from './countries.json';

const Map = ({ targetCountry, onCountrySelected, selectedCountry, wrongGuess, correctGuess, isBlinking, isValidated }) => {
	const svgRef = useRef(null);

	useEffect(() => {
		const width = 800;
		const height = 400;

		const svg = d3.select(svgRef.current)
			.attr("width", width)
			.attr("height", height);

		const projection = d3.geoMercator().scale(130).translate([width / 2, height / 1.5]);
		const path = d3.geoPath().projection(projection);

		svg.selectAll("*").remove(); // Clear previous drawings

		svg.selectAll("path")
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
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
			<svg ref={svgRef}></svg>
		</div>
	);
};

export default Map;
