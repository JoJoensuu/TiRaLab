import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GameBoard from './GameBoard';
import { GameState } from './GameState';
import { AI } from '../Config';

describe('GameBoard component', () => {
  let setGameStateMock;

  beforeEach(() => {
    jest.clearAllMocks();
    setGameStateMock = jest.fn();
  });

  window.alert = jest.fn();

  test('render GameBoard component on screen', () => {
    render(<GameBoard />);
    expect(screen.getByTestId('gameboard')).toBeInTheDocument();
  });

  it('AI makes a move after a player clicks a cell', async () => {
    const setGameState = jest.fn();

    render(<GameBoard gameState={GameState.inProgress} setGameState={setGameState} />);

    // Simulate a player move
    const firstCell = screen.getByTestId('cell-0-0');
    fireEvent.click(firstCell);

    // Wait for the AI to make its move
    await waitFor(() => {
      const cells = screen.getAllByTestId(/cell-\d+-\d+/);
      const aiCells = cells.filter(cell => cell.textContent === AI);
      expect(aiCells.length).toBeGreaterThan(0);
    });
  });
});