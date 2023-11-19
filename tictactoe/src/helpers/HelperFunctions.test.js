import '@testing-library/jest-dom';
import { getAvailableCells } from './HelperFunctions';

describe('getAvailableCells', () => {
  let board;
  beforeEach(() => {
    // Initialize the board before each test
    board = Array(20).fill(null).map(() => Array(20).fill(null));
  });

  test('returns correct amount of cells for initial boardState', () => {
    const availableCells = getAvailableCells(board);
    expect(availableCells.length).toEqual(board.length * board.length);
  });

  test('returns correct amount of cells when no cells available', () => {
    board = Array(20).fill(null).map(() => Array(20).fill('X'));

    const availableCells = getAvailableCells(board);
    expect(availableCells.length).toEqual(0);
  });
});