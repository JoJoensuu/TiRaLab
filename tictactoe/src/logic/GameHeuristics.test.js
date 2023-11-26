import { checkForWin } from './GameHeuristics';
import { PLAYER, AI } from '../Config';
import { GameState } from '../components/GameState';
import '@testing-library/jest-dom';

describe('Tic-Tac-Toe Win Logic', () => {
  let board;
  beforeEach(() => {
    // Initialize the board before each test
    board = Array(20).fill(null).map(() => Array(20).fill(null));
  });
  test('detects horizontal win', () => {
    for (let i = 0; i < 5; i++) {
      board[10][5 + i] = 'X';
    }

    expect(checkForWin(board, 10, 7, PLAYER)).toEqual(GameState.playerWins);
  });

  test('does not falsely detect horizontal win', () => {
    board[10][5] = 'X';
    board[10][6] = 'O';

    expect(checkForWin(board, 10, 5, PLAYER)).toEqual(GameState.inProgress);
  });

  test('detects vertical win', () => {
    for (let i = 0; i < 5; i++) {
      board[0 + i][10] = 'O';
    }

    expect(checkForWin(board, 3, 10, AI)).toEqual(GameState.aiWins);
  });

  test('does not falsely detect vertical win', () => {
    board[1][3] = 'X';
    board[2][3] = 'O';

    expect(checkForWin(board, 1, 3, AI)).toEqual(GameState.inProgress);
  });

  test('detects a draw', () => {
    // Filling the board without creating a winning line
    let toggle = true;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        board[row][col] = toggle ? 'X' : 'O';
        toggle = !toggle;
      }
    }

    // Overwrite the last cell to simulate the last move
    board[19][19] = 'X';

    expect(checkForWin(board, 19, 19, PLAYER)).toEqual(GameState.draw);
  });
});