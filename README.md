# EarthMap Game

## Description

EarthMap Game is an interactive educational game where players are challenged to find countries or monuments on a rotating Earth map. The game features two modes: "Find the Country" and "Find the Monument." Players must answer correctly five times to win the game or they lose after five incorrect answers.

## Installation

Follow the steps below to get the project up and running on your local machine.

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Setup

1. **Clone the repository:**

    ```sh
    git clone https://github.com/yourusername/earthmap-game.git
    cd earthmap-game
    ```

2. **Install the required dependencies:**

    ```sh
    npm install
    ```

3. **Install additional libraries:**

    Ensure you have the following libraries installed:
    - `react-router-dom`
    - `d3-geo`
    - `topojson-client`

    If not installed, you can add them via npm:

    ```sh
    npm install react-router-dom d3-geo topojson-client
    ```

4. **Run the development server:**

    ```sh
    npm start
    ```

    The application will be available at `http://localhost:3000`.

## How to Play

### Introduction

1. When you start the game, you will see an animation displaying "Earth 841_" and "System 451-b".
2. After the animation, an alien will appear and explain the rules of the game.

### Game Modes

1. **Find the Country:**
    - A country name is given.
    - You need to select the correct country on the map.
    - You have 5 jokers which allow you to skip to the next country without guessing.

2. **Find the Monument:**
    - A monument name is given.
    - You need to select the country where the monument is located.
    - You have 2 jokers which allow you to skip to the next monument without guessing.

### Scoring

- You need to answer correctly five times to win.
- If you get five incorrect answers, you lose.

### Controls

- **Validate:** Validates your selection.
- **Next:** Skips to the next country/monument. If you use a joker, the count decreases.

## Additional Features

### Animation and Sound

- The game includes background animation and sound effects.
- Sound plays when the alien explains the game rules and loops until the player proceeds.

### Prevent Repeated Countries/Monuments

- The game ensures that the same country or monument does not appear more than once in a single game session.

## Code Overview

### Main Components

- **Introduction.js:** Handles the introduction sequence and animation.
- **App.js:** Main game logic and UI components.
- **Map.js:** Renders the interactive map using D3.js.
- **StarryBackground.js:** Renders the rotating Earth background.

### Styles

- **styles.css:** Contains the main styles for the game.
- **HyperspaceAnimation.css:** Styles specific to the hyperspace animation.

## Custom Fonts

- **WHEREIST.TTF:** Custom font used for the game's title animation.

## Contributing

If you want to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.