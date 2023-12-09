import '@testing-library/jest-dom';
import { getAvailableCells } from './HelperFunctions';
import { PLAYER, AI } from '../Config';

describe('getAvailableCells', () => {
  let board;
  beforeEach(() => {
    // Initialize the board before each test
    board = Array(20).fill(null).map(() => Array(20).fill(null));
  });

  test('returns no cells for initial boardState as there can be no adjacent moves', () => {
    const availableCells = getAvailableCells(board);
    expect(availableCells.length).toEqual(0);
  });

  test('returns correct amount of cells after a player move', () => {
    board[0][0] = PLAYER;
    const availableCells = getAvailableCells(board);
    expect(availableCells.length).toEqual(3);
  });

  test('returns correct amount of cells when no cells available', () => {
    board = Array(20).fill(null).map(() => Array(20).fill('X'));

    const availableCells = getAvailableCells(board);
    expect(availableCells.length).toEqual(0);
  });

  test('returns a correct amount of cells in midgame state', () => {
    board[0][7] = board[0][8] = board[0][10] = board[0][1] = PLAYER;
    board[1][4] = board[1][9] = board[2][5] = board[2][8] = PLAYER;
    board[2][9] = board[3][8] = board[4][6] = board[4][7] = PLAYER;

    board[0][3] = board[0][6] = board[0][9] = AI;
    board[1][5] = board[1][6] = board[1][7] = board[1][8] = AI;
    board[2][6] = board[2][7] = board[3][6] = board[3][7] = AI;

    const availableCells = getAvailableCells(board);
    expect(availableCells.length).toEqual(25);
  });
});