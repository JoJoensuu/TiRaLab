import { checkForWin,
} from './GameHeuristics';
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
      board[10][5 + i] = AI;
    }

    let move = { rowIndex: 10, colIndex: 7 };

    expect(checkForWin(board, move)).toEqual(GameState.aiWins);
  });

  test('does not falsely detect horizontal win', () => {
    board[10][5] = AI;
    board[10][6] = PLAYER;

    let move = { rowIndex: 10, colIndex: 5 };

    expect(checkForWin(board, move)).toEqual(GameState.inProgress);
  });

  test('detects vertical win', () => {
    for (let i = 0; i < 5; i++) {
      board[0 + i][10] = PLAYER;
    }

    let move = { rowIndex: 3, colIndex: 10 };

    expect(checkForWin(board, move)).toEqual(GameState.playerWins);
  });

  test('does not falsely detect vertical win', () => {
    board[1][3] = AI;
    board[2][3] = PLAYER;

    let move = { rowIndex: 1, colIndex: 3 };

    expect(checkForWin(board, move)).toEqual(GameState.inProgress);
  });

  test('detects a draw', () => {
    // Filling the board without creating a winning line
    let toggle = true;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        board[row][col] = toggle ? AI : PLAYER;
        toggle = !toggle;
      }
    }

    // Overwrite the last cell to simulate the last move
    board[19][19] = AI;

    let move = { rowIndex: 19, colIndex: 19 };

    expect(checkForWin(board, move)).toEqual(GameState.draw);
  });
});