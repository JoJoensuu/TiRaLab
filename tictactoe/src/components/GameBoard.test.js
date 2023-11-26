import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GameBoard from './GameBoard';
import * as AI from '../logic/AI';
import { GameState } from './GameState';

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

  test('clicking a cell puts the current players mark in it', async () => {
    render(<GameBoard gameState={GameState.inProgress} setGameState={setGameStateMock} />);
    const firstCell = screen.getByTestId('cell-0-0');
    fireEvent.click(firstCell);
    expect(firstCell.textContent).toBe('X');
  });
});