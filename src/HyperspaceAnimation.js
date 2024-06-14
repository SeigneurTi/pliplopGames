import { TweenMax, Power2 } from 'gsap';
import _ from 'lodash';
import * as THREE from 'three';
import * as d3 from 'd3';

const randomInRange = (max, min) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const ACTIVE_PROBABILITY = 0;
const BASE_SIZE = 1;
const VELOCITY_INC = 1.01;
const VELOCITY_INIT_INC = 1.025;
const JUMP_VELOCITY_INC = 1.25;
const JUMP_SIZE_INC = 1.15;
const SIZE_INC = 1.01;
const RAD = Math.PI / 180;
const WARP_COLORS = [
    [197, 239, 247],
    [25, 181, 254],
    [77, 5, 232],
    [165, 55, 253],
    [255, 255, 255],
];

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

class Star {
    STATE = {
        alpha: Math.random(),
        angle: randomInRange(0, 360) * RAD,
    };
    reset = () => {
        const angle = randomInRange(0, 360) * (Math.PI / 180);
        const vX = Math.cos(angle);
        const vY = Math.sin(angle);
        const travelled =
            Math.random() > 0.5
                ? Math.random() * Math.max(window.innerWidth, window.innerHeight) +
                Math.random() * (window.innerWidth * 0.24)
                : Math.random() * (window.innerWidth * 0.25);
        this.STATE = {
            ...this.STATE,
            iX: undefined,
            iY: undefined,
            active: travelled ? true : false,
            x: Math.floor(vX * travelled) + window.innerWidth / 2,
            vX,
            y: Math.floor(vY * travelled) + window.innerHeight / 2,
            vY,
            size: BASE_SIZE,
        };
    };
    constructor() {
        this.reset();
    }
}

const generateStarPool = size => new Array(size).fill().map(() => new Star());

class JumpToHyperspace {
    STATE = {
        stars: generateStarPool(300),
        bgAlpha: 0,
        sizeInc: SIZE_INC,
        velocity: VELOCITY_INC,
        running: true // Add a flag to control animation
    };
    canvas = document.createElement('canvas');
    context = this.canvas.getContext('2d');
    constructor() {
        this.setup();
        document.body.appendChild(this.canvas);
        this.render();
        // Automatically start the animation without user interaction
        setTimeout(this.initiate, 2000); // Start the hyperspace initiation after 2 seconds
        setTimeout(this.enter, 6000); // End the hyperspace initiation after 4 seconds

        // Setup Three.js scene for the earth
        this.initThreeJS();
        // Animate the earth during the last 2 seconds of the hyperspace animation
        setTimeout(this.animateEarth, 8000); // Start the earth animation after 8 seconds
    }

    generateEarthTexture(callback) {
        const width = 1024;
        const height = 512;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');

        // Set background color
        context.fillStyle = '#002fa7';
        context.fillRect(0, 0, width, height);

        const projection = d3.geoEquirectangular().scale(163).translate([width / 2, height / 2]);
        const path = d3.geoPath(projection, context);

        d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then(data => {
            data.features.forEach(feature => {
                context.beginPath();
                path(feature);
                const centroid = d3.geoCentroid(feature);
                context.fillStyle = getClimateColor(centroid[1]);
                context.fill();
                context.strokeStyle = '#000000';
                context.lineWidth = 0.5;
                context.stroke();
            });

            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            callback(texture);
        });
    }

    initThreeJS() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '1000'; // Ensure it is above other elements
        document.body.appendChild(this.renderer.domElement);

        this.generateEarthTexture(texture => {
            const geometry = new THREE.SphereGeometry(0.1, 32, 32);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            this.earth = new THREE.Mesh(geometry, material);
            this.scene.add(this.earth);
            this.camera.position.z = 5;

            this.earth.visible = false; // Hide the earth initially

            const animate = () => {
                if (this.STATE.running) {
                    requestAnimationFrame(animate);
                    this.renderer.render(this.scene, this.camera);
                }
            };
            animate();
        });
    }

    render = () => {
        const {
            STATE: { bgAlpha, velocity, sizeInc, initiating, jumping, stars, running },
            context,
            render,
        } = this;
        if (!running) return; // Stop rendering if the flag is false
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (bgAlpha > 0) {
            context.fillStyle = `rgba(31, 58, 157, ${bgAlpha})`;
            context.fillRect(0, 0, window.innerWidth, window.innerHeight);
        }
        const nonActive = stars.filter(s => !s.STATE.active);
        if (!initiating && nonActive.length > 0) {
            nonActive[0].STATE.active = true;
        }
        for (const star of stars.filter(s => s.STATE.active)) {
            const { active, x, y, iX, iY, iVX, iVY, size, vX, vY } = star.STATE;
            if (
                ((iX || x) < 0 || (iX || x) > window.innerWidth || (iY || y) < 0 || (iY || y) > window.innerHeight) &&
                active &&
                !initiating
            ) {
                star.reset(true);
            } else if (active) {
                const newIX = initiating ? iX : iX + iVX;
                const newIY = initiating ? iY : iY + iVY;
                const newX = x + vX;
                const newY = y + vY;
                const caught =
                    (vX < 0 && newIX < x) || (vX > 0 && newIX > x) || (vY < 0 && newIY < y) || (vY > 0 && newIY > y);
                star.STATE = {
                    ...star.STATE,
                    iX: caught ? undefined : newIX,
                    iY: caught ? undefined : newIY,
                    iVX: caught ? undefined : iVX * VELOCITY_INIT_INC,
                    iVY: caught ? undefined : iVY * VELOCITY_INIT_INC,
                    x: newX,
                    vX: star.STATE.vX * velocity,
                    y: newY,
                    vY: star.STATE.vY * velocity,
                    size: initiating ? size : size * (iX || iY ? SIZE_INC : sizeInc),
                };
                let color = `rgba(255, 255, 255, ${star.STATE.alpha})`;
                if (jumping) {
                    const [r, g, b] = WARP_COLORS[randomInRange(0, WARP_COLORS.length)];
                    color = `rgba(${r}, ${g}, ${b}, ${star.STATE.alpha})`;
                }
                context.strokeStyle = color;
                context.lineWidth = size;
                context.beginPath();
                context.moveTo(star.STATE.iX || x, star.STATE.iY || y);
                context.lineTo(star.STATE.x, star.STATE.y);
                context.stroke();
            }
        }
        requestAnimationFrame(render);
    };

    animateEarth = () => {
        this.earth.visible = true; // Show the earth
        TweenMax.fromTo(
            this.earth.scale,
            2,
            { x: 0.1, y: 0.1, z: 0.1 },
            { x: 20, y: 20, z: 20, ease: Power2.easeInOut } // Adjusting the scale to be 50x larger
        );
    };

    initiate = () => {
        if (this.STATE.jumping || this.STATE.initiating) return;
        this.STATE = {
            ...this.STATE,
            initiating: true,
            initiateTimestamp: new Date().getTime(),
        };
        TweenMax.to(this.STATE, 0.25, { velocity: VELOCITY_INIT_INC, bgAlpha: 0.3 });
        for (const star of this.STATE.stars.filter(s => s.STATE.active)) {
            star.STATE = {
                ...star.STATE,
                iX: star.STATE.x,
                iY: star.STATE.y,
                iVX: star.STATE.vX,
                iVY: star.STATE.vY,
            };
        }
    };
    jump = () => {
        this.STATE = {
            ...this.STATE,
            bgAlpha: 0,
            jumping: true,
        };
        TweenMax.to(this.STATE, 0.25, { velocity: JUMP_VELOCITY_INC, bgAlpha: 0.75, sizeInc: JUMP_SIZE_INC });
        setTimeout(() => {
            this.STATE = {
                ...this.STATE,
                jumping: false,
            };
            TweenMax.to(this.STATE, 0.25, { bgAlpha: 0, velocity: VELOCITY_INC, sizeInc: SIZE_INC });
        }, 2500);
    };
    enter = () => {
        if (this.STATE.jumping) return;
        const { initiateTimestamp } = this.STATE;
        this.STATE = {
            ...this.STATE,
            initiating: false,
            initiateTimestamp: undefined,
        };
        if (new Date().getTime() - initiateTimestamp > 600) {
            this.jump();
        } else {
            TweenMax.to(this.STATE, 0.25, { velocity: VELOCITY_INC, bgAlpha: 0 });
        }
    };
    setup = () => {
        this.context.lineCap = 'round';
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
    };
    reset = () => {
        this.STATE = {
            ...this.STATE,
            stars: generateStarPool(300),
        };
        this.setup();
    };
    cleanup = () => {
        // Cleanup the Three.js scene
        this.STATE.running = false; // Stop the animation
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        if (document.body.contains(this.renderer.domElement)) {
            document.body.removeChild(this.renderer.domElement);
        }
        // Remove the canvas element
        if (document.body.contains(this.canvas)) {
            document.body.removeChild(this.canvas);
        }
    };
}
export default JumpToHyperspace;
