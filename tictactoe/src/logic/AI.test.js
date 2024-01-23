import { selectBestMove, evaluateBoardForAI, checkForWinningMove, minimax } from './AI';
import { getAvailableCells, updateAvailableCells } from '../helpers/HelperFunctions';
import { AI, PLAYER, params } from '../Config';

describe('AI move selection logic', () => {
  let board;

  describe('evaluateBoardForAI', () => {

    beforeEach(() => {
      board = Array(params.GRID_SIZE).fill(null).map(() => Array(params.GRID_SIZE).fill(null));
    });

    it('correctly evaluates a strong AI advantage', () => {
      // Setup a board where AI has a clear advantage
      for (let i = 0; i < 4; i++) {
        board[0][i] = AI;
      }

      const score = evaluateBoardForAI(board, true, 4);
      expect(score).toBeGreaterThan(1000); // Expect the highest possible score for AI advantage
    });

    it('correctly evaluates a strong player advantage', () => {
      // Setup a board where the player has a clear advantage
      for (let i = 0; i < 4; i++) {
        board[1][i] = PLAYER;
      }

      const score = evaluateBoardForAI(board, true, 0);
      expect(score).toBe(0); // Expect zero score indicating player advantage
    });

    it('correctly evaluates a neutral board', () => {
      // Setup a neutral board
      board[2][0] = AI;
      board[2][1] = PLAYER;

      const score = evaluateBoardForAI(board, true, 2);
      expect(score).toBeCloseTo(0, -10); // Neutral board should have a score close to 0
    });
  });

  describe('selectBestMove', () => {
    // Setup an empty board
    beforeEach(() => {
      board = Array(params.GRID_SIZE).fill(null).map(() => Array(params.GRID_SIZE).fill(null));
    });

    it('AI tries to block one side when player has 3 pieces in a row', () => {
      // Setup a board where the player has 3 in a horizontal row
      board[0][10] = PLAYER;
      board[0][11] = PLAYER;
      board[0][12] = PLAYER;

      let moveOptions = getAvailableCells(board);

      const aiMove = selectBestMove(board, moveOptions);
      expect(aiMove).toEqual({ rowIndex: 0, colIndex: 9 }); // AI should block the player
    });

    it('correctly returns a blocking move when player is about to win', () => {
      // Setup a board where the player has a horizontal row with 1 piece missing
      board[0][0] = board[0][1] = board[0][2] = board[0][3] = PLAYER;

      let moveOptions = getAvailableCells(board);

      const aiMove = selectBestMove(board, moveOptions);
      expect(aiMove).toEqual({ rowIndex: 0, colIndex: 4 }); // AI should correctly block the player move
    });

    it('correctly returns a blocking move when player is about to win with a more complicated gameBoard', () => {
      board[0][7] = board[0][8] = board[0][10] = board[0][1] = PLAYER;
      board[1][4] = board[1][9] = board[2][5] = board[2][8] = PLAYER;
      board[2][9] = board[3][8] = board[4][6] = board[4][7] = PLAYER;

      board[0][3] = board[0][6] = board[0][9] = AI;
      board[1][5] = board[1][6] = board[1][7] = board[1][8] = AI;
      board[2][6] = board[2][7] = board[3][6] = board[3][7] = AI;

      let moveOptions = getAvailableCells(board);

      const aiMove = selectBestMove(board, moveOptions);
      expect(aiMove).toEqual({ rowIndex: 4, colIndex: 5 }); // AI should correctly go for the winning move
    });

    it('correctly identifies a better winning position', () => {
      board[9][9] = board[9][10] = board[10][11] = board[11][11] = AI;

      let moveOptions = getAvailableCells(board);

      const aiMove = selectBestMove(board, moveOptions);
      expect(aiMove).toEqual({ rowIndex: 9, colIndex: 11 }); // AI should correctly go for the winning move
    });

    it('will select a move to block a future win', () => {
      board[10][10] = board[10][11] = board[11][12] = board[12][12] = PLAYER;
      board[7][7] = AI;

      let moveOptions = getAvailableCells(board);

      const aiMove = selectBestMove(board, moveOptions);
      expect(aiMove).toEqual({ rowIndex: 10, colIndex: 12 });
    });

    it('correctly tries to build a winning position while blocking the player from winning', () => {
      board[6][5] = board[7][5] = board[7][6] = AI;
      board[4][12] = board[5][12] = board[6][12] = PLAYER;

      let availableCells = getAvailableCells(board);

      let firstAIMove = selectBestMove(board, availableCells);

      expect(firstAIMove).toEqual({ rowIndex: 3, colIndex: 12 });

      board[3][12] = AI;

      board[7][12] = PLAYER;

      let playerFirstMove = { rowIndex: 7, colIndex: 12 };

      let newAvailableCells = updateAvailableCells(availableCells, playerFirstMove, board);

      let secondAIMove = selectBestMove(board, newAvailableCells);

      expect(secondAIMove).toEqual({ rowIndex: 8, colIndex: 12 });
    });
  });

  describe('checkForWinningMove', () => {
    beforeEach(() => {
      board = Array(params.GRID_SIZE).fill(null).map(() => Array(params.GRID_SIZE).fill(null));
    });

    it('identifies a winning move with one side blocked', () => {
      // Setup a board where AI has a clear winning move
      board[0][0] = AI;
      board[0][1] = AI;
      board[0][2] = AI;
      board[0][3] = AI;

      const moves = getAvailableCells(board);
      const winningMove = checkForWinningMove(board, moves);
      expect(winningMove).toEqual({ rowIndex: 0, colIndex: 4, score: null }); // Expect AI to complete the line
    });

    it('identifies a winning move with no sides blocked', () => {
      // Setup a board where AI has a clear winning move
      board[0][1] = AI;
      board[0][2] = AI;
      board[0][3] = AI;
      board[0][4] = AI;

      const moves = getAvailableCells(board);
      const winningMove = checkForWinningMove(board, moves);
      expect(winningMove).toEqual({ rowIndex: 0, colIndex: 0, score: null }); // Expect AI to complete the line
    });

    it('identifies a diagonal winning move', () => {
      // Setup a board where AI has a diagonal winning move
      board[7][7] = AI;
      board[8][8] = AI;
      board[9][9] = AI;
      board[10][10] = AI;

      const moves = getAvailableCells(board);
      const winningMove = checkForWinningMove(board, moves);
      expect(winningMove).toEqual({ rowIndex: 6, colIndex: 6, score: null }); // Expect AI to complete the line
    });

    it('identifies a diagonal winning move when player also has 4 in a row diagonally', () => {
      // Setup a board where AI has a diagonal winning move
      board[7][7] = board[8][8] = board[9][9] = board[10][10] = AI;
      board[7][6] = board[8][7] = board[9][8] = board[10][9] = PLAYER;

      const moves = getAvailableCells(board);
      const winningMove = checkForWinningMove(board, moves);
      expect(winningMove).toEqual({ rowIndex: 6, colIndex: 6, score: null }); // Expect AI to complete the line
    });

    it('returns null when there is no winning move', () => {
      // Setup a board with no immediate winning move
      board[1][0] = AI;
      board[1][1] = AI;

      const moves = getAvailableCells(board);
      const winningMove = checkForWinningMove(board, moves);
      expect(winningMove).toBeNull(); // No immediate winning move
    });
  });
});

describe.only('minimax', () => {
  let board;
  // Setup an empty board
  beforeEach(() => {
    board = Array(params.GRID_SIZE).fill(null).map(() => Array(params.GRID_SIZE).fill(null));
  });

  it('basic minimax test', () => {
    board[0][0] = board[1][0] = board[2][0] = board[3][0] = PLAYER;

    board[0][1] = board[0][2] = board[0][3] = AI;

    let availableCells = getAvailableCells(board);

    let bestMove = minimax(board, availableCells, 5, true, -10, 10);

    expect(bestMove).toEqual({ score: 0, rowIndex: 3, colIndex: 4 });
  });


});