import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import GameBoard from './GameBoard';

describe('GameBoard component', () => {

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

  test('alternates turns between X and O', () => {
    render(<GameBoard />);
    const firstCell = screen.getByTestId('cell-0-0');
    const secondCell = screen.getByTestId('cell-0-1');
    fireEvent.click(firstCell);
    fireEvent.click(secondCell);
    expect(firstCell.textContent).toBe('X');
    expect(secondCell.textContent).toBe('O');
  });

});