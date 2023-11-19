import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GameBoard from './GameBoard';
import * as gameHeuristics from '../logic/GameHeuristics';

jest.mock('../logic/AI', () => ({
  makeAIMove: jest.fn()
}));

describe('GameBoard component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset the mock to return true
    jest.spyOn(gameHeuristics, 'checkForWin').mockReturnValue(true);

    let board;
    // Initialize board before each test
    board = Array(20).fill(null).map(() => Array(20).fill(null));
  });

  afterEach(() => {
    // Restore the original implementation after each test
    gameHeuristics.checkForWin.mockRestore();
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
    render(<GameBoard />);

    fireEvent.click(screen.getByTestId('cell-0-0'));

    // Use waitFor to handle asynchronous state updates and setTimeout
    await waitFor(() => {
      expect(screen.getByTestId('cell-0-0').textContent).toBe('');
    });
  });
});