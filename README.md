# Mouse Platformer - Telegram Mini App

A simple Flappy Bird-style platformer game featuring a mouse character, built as a Telegram Mini App using React.

## Features
- Simple one-button gameplay (touch/click to jump)
- Score tracking
- Background music
- Responsive design for mobile devices
- Telegram Mini App integration

## Setup
1. Install dependencies:
```bash
npm install
```

2. Add required assets:
- Place a mouse character image at `src/shared/assets/images/mouse.png`
- Place background music at `src/shared/assets/sounds/background.mp3`

3. Start the development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## Game Controls
- Click or tap anywhere on the screen to make the mouse jump
- Avoid obstacles by navigating through the gaps
- Score points by successfully passing through obstacles
- Game ends if you hit an obstacle or go out of bounds

## Project Structure (FSD Architecture)
```
src/
├── app/          # Application initialization
├── pages/        # Game page components
├── entities/     # Game canvas and core logic
└── shared/       # Shared assets and types
```

## Technologies Used
- React
- TypeScript
- Styled Components
- Web Audio API (via use-sound)
- Telegram Mini App SDK 