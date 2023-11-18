import { checkForWin } from './GameHeuristics';
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

    expect(checkForWin(board, 10, 7)).toBeTruthy();
  });

  test('does not falsely detect horizontal win', () => {
    board[10][5] = 'X';
    board[10][6] = 'O';

    expect(checkForWin(board, 10, 5)).toBeFalsy();
  });

  test('detects vertical win', () => {
    for (let i = 0; i < 5; i++) {
      board[0 + i][10] = 'O';
    }

    expect(checkForWin(board, 3, 10)).toBeTruthy();
  });

  test('does not falsely detect vertical win', () => {
    board[1][3] = 'X';
    board[2][3] = 'O';

    expect(checkForWin(board, 1, 3)).toBeFalsy();
  });
});