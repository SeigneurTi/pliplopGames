import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import './styles.css'; // Assurez-vous d'importer votre CSS

const Map = ({ targetCountry, onCountrySelected, selectedCountry, wrongGuess, correctGuess, isBlinking, isValidated, setRotation, isPlaying }) => {
    const svgRef = useRef();
    const projectionRef = useRef();
    const pathRef = useRef();

    const [localRotation, setLocalRotation] = useState([0, 0, 0]);
    const [countriesData, setCountriesData] = useState(null);

    useEffect(() => {
        d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then(data => {
            setCountriesData(data);
        });
    }, []);

    const getClimateColor = (latitude) => {
        if (latitude > 60 || latitude < -60) {
            return '#A9CCE3'; // Cold zones (Blueish)
        } else if ((latitude > 30 && latitude < 60) || (latitude > -60 && latitude < -30)) {
            return '#A2D9CE'; // Temperate zones (Greenish)
        } else if ((latitude > 10 && latitude < 30) || (latitude > -30 && latitude < -10)) {
            return '#F9E79F'; // Desert zones (Yellowish)
        } else {
            return '#ABEBC6'; // Tropical zones (Green)
        }
    };

    const getFillColor = useCallback((country) => {
        const latitude = d3.geoCentroid(country)[1];
        const climateColor = getClimateColor(latitude);

        if (correctGuess === country.properties.name) {
            return isBlinking ? 'green' : climateColor;
        } else if (wrongGuess === country.properties.name) {
            return isBlinking ? 'red' : climateColor;
        } else if (selectedCountry === country.properties.name) {
            return 'yellow';
        } else {
            return climateColor;
        }
    }, [correctGuess, wrongGuess, selectedCountry, isBlinking]);

    useEffect(() => {
        if (!countriesData) return;

        const width = 600;
        const height = 600;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const projection = d3.geoOrthographic()
            .scale(280)
            .translate([width / 2, height / 2])
            .rotate(localRotation)
            .clipAngle(90);

        projectionRef.current = projection;

        const path = d3.geoPath().projection(projection);
        pathRef.current = path;

        svg.selectAll("*").remove(); // Clear previous drawings

        svg.append("path")
            .datum({ type: "Sphere" })
            .attr("d", path)
            .attr("fill", "#002fa7");

        const g = svg.append("g");

        g.selectAll("path")
            .data(countriesData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", d => getFillColor(d))
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("pointer-events", isPlaying ? "all" : "none") // Disable interactions if not playing
            .on("click", (event, d) => {
                if (isPlaying && !isValidated && d) {
                    onCountrySelected(d.properties.name);
                    d3.select(event.target).attr("fill", "yellow");
                }
            })
            .on("mouseover", (event, d) => {
                if (isPlaying && !isValidated && d && d.properties.name !== selectedCountry) {
                    d3.select(event.target).attr("fill", "lightblue");
                }
            })
            .on("mouseout", (event, d) => {
                if (isPlaying && !isValidated && d && d.properties.name !== selectedCountry) {
                    d3.select(event.target).attr("fill", getFillColor(d));
                }
            });

        const drag = d3.drag()
            .on("drag", (event) => {
                if (isPlaying) {
                    const rotate = projection.rotate();
                    const dx = event.dx / width * 360;
                    const dy = event.dy / height * 180;
                    projection.rotate([rotate[0] + dx, rotate[1] - dy]);
                    svg.selectAll("path").attr("d", path);
                    setLocalRotation(projection.rotate());
                    setRotation(projection.rotate());
                }
            });

        svg.call(drag);

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", (event) => {
                if (isPlaying) {
                    const { transform } = event;
                    projection.scale(280 * transform.k);
                    svg.selectAll("path").attr("d", path);
                }
            });

        svg.call(zoom);

        if (wrongGuess && targetCountry) {
            const targetFeature = countriesData.features.find(
                feature => feature.properties.name === targetCountry
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

        let rotateInterval;
        if (!isPlaying) {
            rotateInterval = setInterval(() => {
                const rotate = projection.rotate();
                rotate[0] += 0.1; // Adjust this value to control the rotation speed
                projection.rotate(rotate);
                svg.selectAll("path").attr("d", path);
                setLocalRotation(projection.rotate());
                setRotation(projection.rotate());
            }, 50); // Adjust this value to control the frame rate
        }

        return () => clearInterval(rotateInterval);
    }, [localRotation, targetCountry, selectedCountry, wrongGuess, correctGuess, isBlinking, isValidated, countriesData, getFillColor, onCountrySelected, setRotation, isPlaying]);

    return (
        <div>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default Map;
