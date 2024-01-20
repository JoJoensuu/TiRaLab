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

  /*it('AI makes a move after a player clicks a cell', async () => {
    const setGameState = jest.fn();

    render(<GameBoard gameState={GameState.inProgress} setGameState={setGameState} />);

    let gameState = GameState.inProgress;
    setGameState.mockImplementation((newState) => { gameState = newState; });

    // Simulate a player move
    const firstCell = screen.getByTestId('cell-0-0');
    fireEvent.click(firstCell);

    // Wait for the AI to make its move
    await waitFor(() => {
      // Ensure the component had time to process the move and update the state
      const aiCells = screen.getAllByTestId(/cell-\d+-\d+/).filter(cell => cell.textContent === AI);
      expect(aiCells.length).toBeGreaterThan(0);
    });
  });

  it('AI wins against an opponent who always selects the first available cell', async () => {
    const setGameState = jest.fn();

    // Render the GameBoard component with initial gameState
    render(<GameBoard gameState={GameState.inProgress} setGameState={setGameState} />);

    // Continuously simulate moves and check for the game's end
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Find and click on the first available cell
      const availableCells = screen.getAllByTestId(/cell-\d+-\d+/).filter(cell => !cell.textContent);
      if (availableCells.length > 0) {
        fireEvent.click(availableCells[0]);
      } else {
        // No available cells, break the loop
        break;
      }

      // Wait for the game state to be updated
      await waitFor(() => {
        expect(setGameState).toHaveBeenCalled();
      });

      // Retrieve the last call to setGameState to check the current game state
      const lastCall = setGameState.mock.calls[setGameState.mock.calls.length - 1];
      const currentGameState = lastCall[0];

      // Check if the game has ended
      if (currentGameState !== GameState.inProgress) {
        // Expect AI to win
        expect(currentGameState).toBe(GameState.aiWins);
        break;
      }

      // Reset the mock for the next iteration
      setGameState.mockClear();
    }
  }, 20000);*/
});