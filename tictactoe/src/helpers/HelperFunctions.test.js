import '@testing-library/jest-dom';
import { getAvailableCells, updateAvailableCells } from './HelperFunctions';
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

  test('returns correct amount of cells after a player move into a corner', () => {
    board[0][0] = PLAYER;
    const availableCells = getAvailableCells(board);
    expect(availableCells.length).toEqual(8);
  });

  test('returns correct amount of cells from the middle of the board', () => {
    board[9][9] = PLAYER;
    const availableCells = getAvailableCells(board);
    expect(availableCells.length).toEqual(24);
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
    expect(availableCells.length).toEqual(48);
  });
});

describe('updateAvailableCells', () => {
  let board;
  it('should add new adjacent cells and remove the chosen cell', () => {
    board = [
      [null, null, null],
      [null, 'X', null],
      [null, null, null]
    ];
    const availableCells = [{ rowIndex: 1, colIndex: 0 }, { rowIndex: 1, colIndex: 2 }];
    const move = { rowIndex: 1, colIndex: 1 };

    const updatedCells = updateAvailableCells(availableCells, move, board);

    // New adjacent cells should be added
    expect(updatedCells).toContainEqual({ rowIndex: 0, colIndex: 1 });
    expect(updatedCells).toContainEqual({ rowIndex: 2, colIndex: 1 });

    // The chosen cell should be removed
    expect(updatedCells).not.toContainEqual(move);
  });

  it('should not add cells outside the board', () => {
    board = [
      ['X', null],
      [null, null]
    ];
    const availableCells = [{ rowIndex: 1, colIndex: 1 }];
    const move = { rowIndex: 0, colIndex: 0 };

    const updatedCells = updateAvailableCells(availableCells, move, board);

    // No new cells outside the board should be added
    expect(updatedCells).toEqual(expect.arrayContaining([{ rowIndex: 1, colIndex: 1 }]));
  });

  it('should not add duplicate cells', () => {
    board = Array(20).fill(null).map(() => Array(20).fill(null));
    board[4][9] = board[6][7] = AI;
    const availableCells = getAvailableCells(board);
    expect(availableCells.length).toEqual(39);
    const move = { rowIndex: 8, colIndex: 5 };

    const updatedCells = updateAvailableCells(availableCells, move, board);
    expect(updatedCells.length).toEqual(54);

    // Ensure no duplicates
    const duplicates = updatedCells.filter(cell => cell.rowIndex === 0 && cell.colIndex === 0);
    expect(duplicates.length).toBe(0);
  });
});
