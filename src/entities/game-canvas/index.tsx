import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import mouseImage from '../../shared/assets/images/mouse.png';
import tubeBottomImage from '../../shared/assets/images/tube-bottom.png';
import tubeTopImage from '../../shared/assets/images/tube-top.png';

interface GameCanvasProps {
  onScoreUpdate: (score: number) => void;
}

interface Obstacle {
  x: number;
  height: number;
}

const Canvas = styled.canvas`
  border: 2px solid #000;
  background: #87CEEB;
  cursor: pointer;
  touch-action: none;
  width: 100%;
  height: 100vh;
  max-width: 100%;
  max-height: 100vh;
`;

const GameOverScreen = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  color: white;
  text-align: center;
  z-index: 10;
  width: 80%;
  max-width: 300px;
`;

const RestartButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;

  &:hover {
    background: #45a049;
  }
`;

const GRAVITY = 0.3;
const JUMP_FORCE = -8;
const OBSTACLE_SPEED = 3;
const GAP_HEIGHT = 230;
const MOUSE_WIDTH = 60;
const MOUSE_HEIGHT = 60;
const TUBE_WIDTH = 80;
const TUBE_HEIGHT = 300;

export const GameCanvas: React.FC<GameCanvasProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const gameLoopRef = useRef<number | undefined>(undefined);

  // Game state
  const mouseY = useRef(0);
  const mouseVelocity = useRef(0);
  const obstacles = useRef<Obstacle[]>([]);
  const score = useRef(0);

  // Image refs
  const mouseImg = useRef<HTMLImageElement | null>(null);
  const tubeTopImg = useRef<HTMLImageElement | null>(null);
  const tubeBottomImg = useRef<HTMLImageElement | null>(null);

  const resetGame = useCallback(() => {
    if (canvasRef.current) {
      mouseY.current = canvasRef.current.height / 2;
      mouseVelocity.current = 0;
      obstacles.current = [];
      score.current = 0;
      setGameOver(false);
      setShowGameOver(false);
      setFinalScore(0);
      setIsGameStarted(false);
      onScoreUpdate(0);
    }
  }, [onScoreUpdate]);

  const jump = useCallback(() => {
    if (!gameOver) {
      if (!isGameStarted) {
        setIsGameStarted(true);
      }
      mouseVelocity.current = JUMP_FORCE;
    }
  }, [gameOver, isGameStarted]);

  const handleGameOver = useCallback(() => {
    if (!gameOver && isGameStarted) {
      setGameOver(true);
      setShowGameOver(true);
      setFinalScore(score.current);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'default';
      }
    }
  }, [gameOver, isGameStarted]);

  // Load images
  useEffect(() => {
    const mouse = new Image();
    const tubeTop = new Image();
    const tubeBottom = new Image();

    mouse.src = mouseImage;
    tubeTop.src = tubeTopImage;
    tubeBottom.src = tubeBottomImage;

    mouseImg.current = mouse;
    tubeTopImg.current = tubeTop;
    tubeBottomImg.current = tubeBottom;

    return () => {
      mouseImg.current = null;
      tubeTopImg.current = null;
      tubeBottomImg.current = null;
    };
  }, []);

  // Initialize canvas and game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      mouseY.current = height / 2;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Handle input
    const handleInput = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!gameOver) {
        jump();
      }
    };

    document.addEventListener('mousedown', handleInput);
    document.addEventListener('touchstart', handleInput);

    const gameLoop = () => {
      if (!ctx || gameOver || !mouseImg.current || !tubeTopImg.current || !tubeBottomImg.current) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update mouse position
      mouseVelocity.current += GRAVITY;
      mouseY.current += mouseVelocity.current;

      // Keep mouse within canvas bounds
      if (mouseY.current < 0) {
        mouseY.current = 0;
        mouseVelocity.current = 0;
      }

      // Draw mouse
      ctx.drawImage(
        mouseImg.current,
        50,
        mouseY.current,
        MOUSE_WIDTH,
        MOUSE_HEIGHT
      );
      // Draw border for mouse
      // ctx.strokeStyle = 'blue';
      // ctx.lineWidth = 2;
      // ctx.strokeRect(
      //   50,
      //   mouseY.current,
      //   MOUSE_WIDTH,
      //   MOUSE_HEIGHT
      // );

      // Only generate and update obstacles if game has started
      if (isGameStarted) {
        // Generate obstacles
        const lastObstacle = obstacles.current[obstacles.current.length - 1];
        if (!lastObstacle || lastObstacle.x < canvas.width - 400) {
          // Generate a random position for the gap
          const minGapY = TUBE_HEIGHT + 50;
          const maxGapY = canvas.height - TUBE_HEIGHT - GAP_HEIGHT - 50;
          const gapY = Math.random() * (maxGapY - minGapY) + minGapY;

          obstacles.current.push({
            x: canvas.width,
            height: gapY, // This is now the Y position of the gap
          });
        }

        // Update and draw obstacles
        obstacles.current = obstacles.current.filter((obstacle) => {
          obstacle.x -= OBSTACLE_SPEED;

          // Draw top tube
          if (tubeTopImg.current) {
            ctx.drawImage(
              tubeTopImg.current,
              obstacle.x,
              0,
              TUBE_WIDTH,
              obstacle.height // Top tube extends to the gap
            );
            // Draw border for top tube
            // ctx.strokeStyle = 'red';
            // ctx.lineWidth = 2;
            // ctx.strokeRect(
            //   obstacle.x,
            //   0,
            //   TUBE_WIDTH,
            //   obstacle.height
            // );
          }

          // Draw bottom tube
          if (tubeBottomImg.current) {
            ctx.drawImage(
              tubeBottomImg.current,
              obstacle.x,
              obstacle.height + GAP_HEIGHT, // Bottom tube starts after the gap
              TUBE_WIDTH,
              canvas.height - (obstacle.height + GAP_HEIGHT) // Extends to bottom of screen
            );
            // Draw border for bottom tube
            // ctx.strokeStyle = 'red';
            // ctx.lineWidth = 2;
            // ctx.strokeRect(
            //   obstacle.x,
            //   obstacle.height + GAP_HEIGHT,
            //   TUBE_WIDTH,
            //   canvas.height - (obstacle.height + GAP_HEIGHT)
            // );
          }

          // Check collision
          const mouseRight = 50 + MOUSE_WIDTH;
          const mouseBottom = mouseY.current + MOUSE_HEIGHT;
          const tubeRight = obstacle.x + TUBE_WIDTH;

          // Only check collision if mouse is within tube's x-range
          if (mouseRight > obstacle.x && 50 < tubeRight) {
            // Check collision with top tube
            if (mouseY.current < obstacle.height) {
              handleGameOver();
              return false;
            }

            // Check collision with bottom tube
            if (mouseBottom > obstacle.height + GAP_HEIGHT) {
              handleGameOver();
              return false;
            }
          }

          // Update score
          if (obstacle.x + TUBE_WIDTH < 50 && obstacle.x + TUBE_WIDTH >= 45) {
            score.current++;
            onScoreUpdate(score.current);
          }

          return obstacle.x > -TUBE_WIDTH;
        });
      }

      // Check bottom boundary
      if (mouseY.current > canvas.height - MOUSE_HEIGHT) {
        handleGameOver();
        return;
      }

      if (!gameOver) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    // Start the game loop
    gameLoop();

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
      document.removeEventListener('mousedown', handleInput);
      document.removeEventListener('touchstart', handleInput);
    };
  }, [gameOver, jump, handleGameOver, onScoreUpdate, isGameStarted]);

  // Initialize the game
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  return (
    <>
      <Canvas ref={canvasRef} />
      {showGameOver && (
        <GameOverScreen>
          <h2>Game Over!</h2>
          <p>Your score: {finalScore}</p>
          <RestartButton onClick={resetGame}>Play Again</RestartButton>
        </GameOverScreen>
      )}
    </>
  );
}; 