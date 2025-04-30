import React from 'react';
import { GamePage } from '../pages/game';
import { GlobalStyle } from './styles';

export const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <GamePage />
    </>
  );
}; 