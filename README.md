# Papi Popper - Endless Runner Game

An exciting endless runner game built with Pixi.js featuring a Home Depot employee character with multiple poses and animations!

🎮 **Play the game live:** [https://maxwellsultan.github.io/papi-popper](https://maxwellsultan.github.io/papi-popper)

## 🎮 Game Features

- **Endless Runner Gameplay**: Run, jump, and dodge obstacles in an endless scrolling environment
- **Multiple Character Poses**: The character changes poses based on actions:
  - Normal standing pose
  - Jumping pose when jumping
  - Pointing poses when moving left/right
  - Celebration pose when collecting power-ups
  - Defeated pose when game over
- **Power-ups System**: Collect special power-ups for enhanced abilities:
  - **Speed Boost** (Gold): Increases game speed temporarily
  - **Shield** (Blue): Protects against obstacles and enemies
  - **Double Jump** (Pink): Allows for additional jumping ability
- **Enemy System**: Dodge red enemies that appear randomly
- **Obstacle System**: Jump over brown obstacles to survive
- **Progressive Difficulty**: Game speed increases over time
- **Score System**: Track your progress and try to beat your high score
- **Beautiful UI**: Modern interface with score display and power-up indicators

## 🚀 How to Run

### Option 1: Play Online (Recommended)
🎮 **Play the game live:** [https://maxwellsultan.github.io/papi-popper](https://maxwellsultan.github.io/papi-popper)

### Option 2: Local Development
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:8080`

### Loading Your Sprite Sheet

To use your actual sprite image instead of the placeholder graphics:

1. **Use the helper tool**: Open `save-sprite.html` in your browser to easily save your image with the correct filename
2. **Manual method**: Save your sprite sheet image as `spritesheet.png` in the game directory
3. **Supported formats**: PNG, JPG, JPEG
4. **Supported filenames**: `spritesheet.png`, `sprite.png`, `character.png`, `player.png` (and .jpg/.jpeg variants)

The game will automatically detect and load your sprite sheet. If no sprite sheet is found, it will use colorful placeholder graphics.

### Option 3: Using a local server
If you have Python installed:
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

Or if you have Node.js installed globally:
```bash
npx http-server -p 8080
```

## 🚀 Deploy to GitHub Pages

This project is configured for easy deployment to GitHub Pages:

### Automatic Deployment (Recommended)
1. Push your code to the `main` branch
2. GitHub Actions will automatically deploy to GitHub Pages
3. Your game will be available at `https://[your-username].github.io/papi-popper`

### Manual Deployment
1. Install the gh-pages package:
   ```bash
   npm install
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

3. Go to your repository settings and enable GitHub Pages from the `gh-pages` branch

## 🎯 How to Play

### Controls
- **SPACE**: Jump
- **Arrow Left**: Move left
- **Arrow Right**: Move right

### Objective
- Run as far as possible while avoiding obstacles and enemies
- Collect power-ups to gain advantages
- Try to achieve the highest score possible

### Game Mechanics
- **Jumping**: Press SPACE to jump over obstacles
- **Movement**: Use arrow keys to move horizontally
- **Power-ups**: Collect colored circles for special abilities
- **Collision**: Avoid red enemies and brown obstacles
- **Scoring**: Score increases continuously while playing

## 🎨 Character Poses

The game features 8 different character poses based on the sprite sheet:

1. **Waving/Greeting** - Default standing pose
2. **Double Point Forward** - Used for special actions
3. **Jumping/Leaping** - Active when jumping
4. **Expressive/Hands Up** - Celebration when collecting power-ups
5. **Holding Thin Object** - Game over pose
6. **Right Hand Pointing Forward** - Moving left
7. **Right Hand Pointing Up (Bent Arm)** - Moving right
8. **Right Hand Pointing Up (Extended Arm)** - Alternative right movement

## 🛠️ Technical Details

- **Framework**: Pixi.js 7.3.2
- **Graphics**: 2D WebGL rendering
- **Physics**: Simple gravity and collision detection
- **Animation**: Sprite-based character animations
- **Responsive**: Works on desktop and mobile browsers
- **Deployment**: GitHub Pages ready with automatic CI/CD

## 🎵 Game Elements

- **Background**: Scrolling sky with moving clouds
- **Ground**: Green ground platform
- **Player**: Animated character with Home Depot apron
- **Obstacles**: Brown rectangular blocks
- **Enemies**: Red creatures with eyes
- **Power-ups**: Colored circles with different effects

## 🔧 Customization

You can easily customize the game by modifying the following parameters in `game.js`:

- `gameSpeed`: Initial game speed
- `jumpPower`: Jump height
- `gravity`: Gravity strength
- Power-up spawn rates
- Enemy and obstacle spawn rates
- Character colors and sizes

## 🐛 Troubleshooting

If the game doesn't load:
1. Make sure you're running it from a web server (not just opening the HTML file)
2. Check that Pixi.js is loading correctly
3. Open browser developer tools to check for any JavaScript errors

## 📝 License

MIT License - Feel free to modify and distribute!

---

Enjoy playing Papi Popper! 🏃‍♂️💨
