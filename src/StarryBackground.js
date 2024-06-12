import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const StarryBackground = ({ rotation }) => {
    const mountRef = useRef();
    const starFieldRef = useRef();

    useEffect(() => {
        const mount = mountRef.current;
        const width = mount.clientWidth;
        const height = mount.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();

        renderer.setSize(width, height);
        mount.appendChild(renderer.domElement);

        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });

        const starVertices = [];
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 2000 - 1000;
            const y = Math.random() * 2000 - 1000;
            const z = Math.random() * 2000 - 1000;
            starVertices.push(x, y, z);
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starField = new THREE.Points(starsGeometry, starsMaterial);

        starFieldRef.current = starField;
        scene.add(starField);

        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            mount.removeChild(renderer.domElement);
        };
    }, []);

    useEffect(() => {
        if (starFieldRef.current) {
            const [lon, lat] = rotation;
            starFieldRef.current.rotation.x = lat * (Math.PI / 180);
            starFieldRef.current.rotation.y = lon * (Math.PI / 180);
        }
    }, [rotation]);

    return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>;
};

export default StarryBackground;
