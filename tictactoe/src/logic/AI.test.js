import { selectBestMove, checkForWinningMove, minimax } from './AI';
import { getAvailableCells, updateAvailableCells } from '../helpers/HelperFunctions';
import { AI, PLAYER, params, scores } from '../Config';

describe('AI move selection logic', () => {
  let board;

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

describe('minimax', () => {
  let board;
  // Setup an empty board
  beforeEach(() => {
    board = Array(params.GRID_SIZE).fill(null).map(() => Array(params.GRID_SIZE).fill(null));
  });

  it('identifies a basic blocking move', () => {
    board[0][0] = board[1][0] = board[2][0] = board[3][0] = PLAYER;

    board[0][1] = board[0][2] = board[0][3] = AI;

    let availableCells = getAvailableCells(board);

    let bestMove = minimax(board, availableCells, 0, true, params.ALPHA, params.BETA);

    expect(bestMove).toEqual({ score: 0, rowIndex: 4, colIndex: 0 });
  });

  it('performs correct move to win in one turn', () => {
    board[0][0] = board[1][0] = board[2][0] = board[3][0] = PLAYER;

    board[0][1] = board[0][2] = board[0][3] = board[0][4] = AI;

    let availableCells = getAvailableCells(board);

    let bestMove = minimax(board, availableCells, 0, true, params.ALPHA, params.BETA);

    expect(bestMove).toEqual({ score: scores.WIN_SCORE - 1, rowIndex: 0, colIndex: 5 });
  });

  it('performs correct moves to win in several turns', () => {
    board[4][9] = board[5][9] = board[6][9] = PLAYER;

    board[6][6] = board[7][6] = board[7][7] = AI;

    let availableCells = getAvailableCells(board);

    let firstAIMove = minimax(board, availableCells, 0, true, params.ALPHA, params.BETA);

    expect(firstAIMove).toEqual({ score: scores.DRAW_SCORE, rowIndex: 3, colIndex: 9 });

    board[firstAIMove.rowIndex][firstAIMove.colIndex] = AI;

    availableCells = updateAvailableCells(availableCells, firstAIMove, board);

    let playerMove = { rowIndex: 7, colIndex: 8 };

    board[playerMove.rowIndex][playerMove.colIndex] = PLAYER;

    availableCells = updateAvailableCells(availableCells, playerMove, board);

    let secondAIMove = minimax(board, availableCells, 0, true, params.ALPHA, params.BETA);

    expect(secondAIMove).toEqual({ score: scores.DRAW_SCORE, rowIndex: 2, colIndex: 7 });

    board[secondAIMove.rowIndex][secondAIMove.colIndex] = AI;

    availableCells = updateAvailableCells(availableCells, secondAIMove, board);

    playerMove = { rowIndex: 5, colIndex: 10 };

    board[playerMove.rowIndex][playerMove.colIndex] = PLAYER;

    availableCells = updateAvailableCells(availableCells, playerMove, board);

    let thirdAIMove = minimax(board, availableCells, 0, true, params.ALPHA, params.BETA);

    expect(thirdAIMove).toEqual({ score: scores.DRAW_SCORE, rowIndex: 4, colIndex: 11 });

    board[thirdAIMove.rowIndex][thirdAIMove.colIndex] = AI;

    availableCells = updateAvailableCells(availableCells, thirdAIMove, board);

    playerMove = { rowIndex: 8, colIndex: 7 };

    board[playerMove.rowIndex][playerMove.colIndex] = PLAYER;

    availableCells = updateAvailableCells(availableCells, playerMove, board);

    let forthAIMove = minimax(board, availableCells, 0, true, params.ALPHA, params.BETA);

    expect(forthAIMove).toEqual({ score: scores.DRAW_SCORE, rowIndex: 9, colIndex: 6 });
  });


});