import { selectCell, selectBestMove } from './AI';

describe('selectBestMove function', () => {
  let board;
  beforeEach(() => {
    // Initialize the board before each test
    board = Array(20).fill(null).map(() => Array(20).fill(null));
  });

  test('returns the first available cell when board is empty', () => {
    const cell = selectBestMove(board);
    expect(cell).toEqual({ 'rowIndex': 0, 'colIndex': 0 });
  });
});
