import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GameBoard from './GameBoard';
import * as gameHeuristics from '../logic/GameHeuristics';
import * as AI from '../logic/AI';

describe('GameBoard component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock selectCell to return a specific cell
    jest.spyOn(AI, 'selectCell').mockImplementation((availableCells) => {
      return availableCells[0];
    });
  });

  afterEach(() => {
    // Restore the original implementation after each test
    AI.selectCell.mockRestore();
  });

  window.alert = jest.fn();

  test('render GameBoard component on screen', () => {
    render(<GameBoard />);
    expect(screen.getByTestId('gameboard')).toBeInTheDocument();
  });

  test('clicking a cell puts the current players mark in it', () => {
    render(<GameBoard />);
    const firstCell = screen.getByTestId('cell-0-0');
    fireEvent.click(firstCell);
    expect(firstCell.textContent).toBe('X');
  });

  test('resets the board after a win', async () => {
    jest.spyOn(gameHeuristics, 'checkForWin').mockReturnValue(true);

    render(<GameBoard />);

    fireEvent.click(screen.getByTestId('cell-0-0'));

    await waitFor(() => {
      expect(screen.getByTestId('cell-0-0').textContent).toBe('');
    });

    gameHeuristics.checkForWin.mockRestore();
  });

  test('AI makes a move after the players turn', async () => {
    render(<GameBoard /> );

    fireEvent.click(screen.getByTestId('cell-0-1'));

    await waitFor(() => {
      expect(screen.getByTestId('cell-0-0').textContent).toBe('O');
    });
  });
});