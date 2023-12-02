import { selectCell, selectBestMove, evaluateBoardForAI } from './AI';
import { AI, PLAYER } from '../Config';

describe('AI move selection logic', () => {
  let board;

  describe('evaluateBoardForAI', () => {

    beforeEach(() => {
      board = Array(20).fill(null).map(() => Array(20).fill(null));
    });

    it('correctly evaluates a strong AI advantage', () => {
      // Setup a board where AI has a clear advantage
      for (let i = 0; i < 4; i++) {
        board[0][i] = AI;
      }

      const score = evaluateBoardForAI(board, true);
      expect(score).toBe(Infinity); // Expect the highest possible score for AI advantage
    });

    it('correctly evaluates a strong player advantage', () => {
      // Setup a board where the player has a clear advantage
      for (let i = 0; i < 4; i++) {
        board[1][i] = PLAYER;
      }

      const score = evaluateBoardForAI(board, true);
      expect(score).toBe(0); // Expect the minimum score indicating player advantage
    });

    it('correctly evaluates a neutral board', () => {
      // Setup a neutral board
      board[2][0] = AI;
      board[2][1] = PLAYER;

      const score = evaluateBoardForAI(board, true);
      expect(score).toBeCloseTo(0); // Neutral board should have a score close to 0
    });
  });

  describe('selectBestMove', () => {
    beforeEach(() => {
      board = Array(20).fill(null).map(() => Array(20).fill(null));
    });

    it('correctly returns a blocking move when player is about to win', () => {
      // Setup a neutral board
      board[0][10] = PLAYER;
      board[0][11] = PLAYER;
      board[0][12] = PLAYER;

      const aiMove = selectBestMove(board, 0, 12, PLAYER);
      expect(aiMove).toEqual({ rowIndex: 0, colIndex: 9 }); // Neutral board should have a score close to 0
    });
  });
});