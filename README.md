## Simon Says Game

A browser-based Simon game with progressive speed, score tracking, strict mode, lives mode, keyboard input, and synthesized sound feedback.

### Live Demo

https://dinesh-beniwal-15.github.io/Simon-Says-Game/

### Features

1. Progressive rounds with faster sequence playback at higher levels.
2. Score system with persistent best score using localStorage.
3. Normal mode (3 lives) and strict mode (1 mistake ends the run).
4. Keyboard controls (`R/Y/G/P` or `1/2/3/4`) plus mouse/touch support.
5. Dynamic status updates and responsive modern UI.
6. Built-in audio tones for each color and game-over feedback.

### How to Play

1. Click **Start / Restart** (or press Enter/Space when idle).
2. Watch the sequence of flashing colors.
3. Repeat the sequence using buttons or keyboard.
4. In normal mode, mistakes cost a life and replay the current sequence.
5. In strict mode, one mistake ends the game immediately.

### Project Structure

- `index.html` - App layout and controls.
- `style.css` - Responsive styles and animations.
- `app.js` - Core game state and gameplay logic.

### Run Locally

No build tools are required.

1. Download or clone this repository.
2. Open `index.html` in any modern browser.

