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
});