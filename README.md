Simon Says Game - README
Overview:
Simon Says is a classic memory game where players must repeat an increasingly long sequence of colors and sounds. This web-based implementation features a colorful, responsive design with smooth animations and visual feedback.

Features:
Interactive Gameplay: Click the colored buttons to repeat the sequence

Visual Feedback: Buttons flash when activated by the game or user

Progressive Difficulty: Sequence length increases with each level

Score Tracking: Current level is displayed as your score

Responsive Design: Works on both desktop and mobile devices

Attractive UI: Gradient background with animated elements and stylish buttons

How to Play:
Press any key on your keyboard to start the game

Watch carefully as the game flashes a sequence of colors

Click the buttons in the same order as the sequence

If correct, the game will add another color to the sequence

If incorrect, the game ends and shows your final score

Press any key to restart the game after losing

File Structure:
text
simon-game/
├── index.html      # Main HTML structure
├── style.css       # Styling and animations
└── app.js          # Game logic and functionality
Technologies Used:
HTML5

CSS3 (with animations and gradients)

JavaScript (ES6)

Browser Compatibility
This game works on all modern browsers that support:

CSS Flexbox

CSS Animations

ES6 JavaScript features

Installation:
No installation required! Simply:

Download all three files (index.html, style.css, app.js)

Place them in the same directory

Open index.html in your web browser

Customization:
You can easily customize the game by:

Changing colors in the CSS (.red, .yellow, .green, .purple classes)

Adjusting animation timings in the CSS (@keyframes)

Modifying the difficulty by changing the flash duration in app.js

Game Logic:
The game generates a random sequence of colors

Players must replicate the sequence exactly

Each successful round adds another color to the sequence

The game ends when the player makes a mistake
