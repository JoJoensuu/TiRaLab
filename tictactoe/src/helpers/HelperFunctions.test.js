import '@testing-library/jest-dom';
import { getAvailableCells } from './HelperFunctions';
import { PLAYER } from '../Config';

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
});