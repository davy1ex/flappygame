import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { GameCanvas } from '../../entities/game-canvas';
import { useSound } from 'use-sound';
import backgroundMusic from '../../shared/assets/sounds/background.mp3';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Score = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

export const GamePage: React.FC = () => {
  const [score, setScore] = useState(0);
  const [play] = useSound(backgroundMusic, { volume: 0.5, loop: true });

  useEffect(() => {
    play();
  }, [play]);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  return (
    <GameContainer>
      <Score>Score: {score}</Score>
      <GameCanvas onScoreUpdate={handleScoreUpdate} />
    </GameContainer>
  );
}; 