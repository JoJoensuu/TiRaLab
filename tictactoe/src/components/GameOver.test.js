import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GameOver } from './GameOver';
import { GameState } from './GameState';

describe('GameOver component', () => {
  test('displays "Player Wins!" when player wins', () => {
    render(<GameOver gameState={GameState.playerWins} />);
    expect(screen.getByText('Player Wins!')).toBeInTheDocument();
  });

  test('displays "AI Wins!" when AI wins', () => {
    render(<GameOver gameState={GameState.aiWins} />);
    expect(screen.getByText('AI Wins!')).toBeInTheDocument();
  });

  test('displays "It\'s a Draw!" when the game is a draw', () => {
    render(<GameOver gameState={GameState.draw} />);
    expect(screen.getByText('It\'s a Draw!')).toBeInTheDocument();
  });

  test('displays "Game in Progress..." as default message', () => {
    render(<GameOver gameState={GameState.inProgress} />);
    expect(screen.getByText('Game in Progress...')).toBeInTheDocument();
  });
});