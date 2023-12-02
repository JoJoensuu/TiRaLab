import { checkForWin,
  getConsecutiveScore,
  evaluateDirections,
  evaluateHorizontal,
  evaluateVertical,
  getScore
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
      board[10][5 + i] = 'X';
    }

    expect(checkForWin(board, 10, 7, PLAYER)).toEqual(GameState.playerWins);
  });

  test('does not falsely detect horizontal win', () => {
    board[10][5] = 'X';
    board[10][6] = 'O';

    expect(checkForWin(board, 10, 5, PLAYER)).toEqual(GameState.inProgress);
  });

  test('detects vertical win', () => {
    for (let i = 0; i < 5; i++) {
      board[0 + i][10] = 'O';
    }

    expect(checkForWin(board, 3, 10, AI)).toEqual(GameState.aiWins);
  });

  test('does not falsely detect vertical win', () => {
    board[1][3] = 'X';
    board[2][3] = 'O';

    expect(checkForWin(board, 1, 3, AI)).toEqual(GameState.inProgress);
  });

  test('detects a draw', () => {
    // Filling the board without creating a winning line
    let toggle = true;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        board[row][col] = toggle ? 'X' : 'O';
        toggle = !toggle;
      }
    }

    // Overwrite the last cell to simulate the last move
    board[19][19] = 'X';

    expect(checkForWin(board, 19, 19, PLAYER)).toEqual(GameState.draw);
  });

  describe('getConsecutiveScore', () => {
    it('returns a minimum score if both sides blocked and 4 in a row', () =>  {
      expect(getConsecutiveScore(4, 2, true)).toBe(0);
    });

    it('returns the maximum score for 5 in a row with no blocks', () => {
      expect(getConsecutiveScore(5, 0, true)).toBe(Infinity);
    });

    it('returns a high score for 4 in a row with no blocks on current turn', () => {
      expect(getConsecutiveScore(4, 0, true)).toBe(Infinity / 2);
    });

    it('returns a high score for 4 in a row with one side blocked on current turn', () => {
      expect(getConsecutiveScore(4, 1, true)).toBe(Infinity / 2);
    });

    it('returns a lower score for 4 in a row on opposing players turn', () => {
      expect(getConsecutiveScore(4, 0, false)).toBe(Infinity / 4);
    });

    it('returns a lower score for 4 in a row with one side blocked on opposing players turn', () => {
      expect(getConsecutiveScore(4, 1, false)).toBe(200);
    });

    it('returns a higher score for 3 in a row with no blocks on current turn', () => {
      expect(getConsecutiveScore(3, 0, true)).toBe(50000);
    });

    it('returns a low score for 3 in a row with one side blocked on opposing players turn', () => {
      expect(getConsecutiveScore(3, 1, false)).toBe(5);
    });

    it('returns a higher score for 2 in a row with no blocks on current turn', () => {
      expect(getConsecutiveScore(2, 0, true)).toBe(7);
    });

    it('returns a low score for 2 in a row with no blocks on current turn', () => {
      expect(getConsecutiveScore(2, 1, false)).toBe(3);
    });

    it('returns a low score for 1 in a row', () => {
      expect(getConsecutiveScore(1, 0, false)).toBe(1);
    });
  });

  describe('evaluateDirections', () => {
    let board;

    beforeEach(() => {
      // Initialize the board before each test
      board = Array(20).fill(null).map(() => Array(20).fill(null));
    });

    it('correctly evaluates a horizontal direction with potential AI win', () => {
      for (let i = 0; i < 4; i++) {
        board[0][i] = AI;
      }

      board[0][4] = null;
      const scoreData = [0, 2, 0];
      for (let i = 0; i <= 4; i++) {
        evaluateDirections(board, 0, i, true, true, scoreData);
      }
      expect(scoreData[2]).toBeGreaterThan(0);
    });

    it('correctly evaluates when AI potential win is blocked by player', () => {
      board[0][0] = board[0][1] = board[0][2] = 'O';
      board[0][3] = 'X';
      const scoreData = [0, 2, 0];
      for (let i = 0; i <= 3; i++) {
        evaluateDirections(board, 0, i, true, true, scoreData);
      }
      expect(scoreData[2]).toBeLessThan(2); // AI's win is blocked
    });

    it('correctly evaluates player potential win', () => {
      board[1][0] = board[1][1] = board[1][2] = board[1][3] = 'X';
      const scoreData = [0, 2, 0];
      for (let i = 0; i <= 4; i++) {
        evaluateDirections(board, 1, i, true, true, scoreData);
      }
      expect(scoreData[2]).toBe(0); // Player is about to win, no advantage for AI
    });

    it('evaluates a neutral board state', () => {
      board[2][0] = 'O';
      board[2][1] = 'X';
      const scoreData = [0, 2, 0];
      for (let i = 0; i <= 1; i++) {
        evaluateDirections(board, 2, i, true, true, scoreData);
      }
      expect(scoreData[2]).toBe(0); // No clear advantage
    });

    it('evaluates an entirely empty board', () => {
      const scoreData = [0, 2, 0];
      evaluateDirections(board, 10, 10, true, true, scoreData);
      expect(scoreData[2]).toBe(0); // Empty board should have no score
    });
  });

  describe('evaluateHorizontal', () => {
    let board;

    beforeEach(() => {
    // Initialize the board before each test
      board = Array(20).fill(null).map(() => Array(20).fill(null));
    });

    it('correctly evaluates a potential win for AI horizontally', () => {
    // Set up a board where AI is about to win horizontally
      for (let i = 0; i < 4; i++) {
        board[0][i] = AI;
      }

      const score = evaluateHorizontal(board, true, true);
      expect(score).toBe(Infinity); // Expect a positive score for AI's advantage
    });

    it('correctly evaluates a blocked AI opportunity horizontally', () => {
    // Set up a board where AI's potential win is blocked by the player
      for (let i = 0; i < 3; i++) {
        board[1][i] = AI;
      }
      board[1][3] = PLAYER;

      const score = evaluateHorizontal(board, true, true);
      expect(score).toBe(0); // Expect a score less than a win, as the line is blocked
    });
  });

  describe('evaluateVertical', () => {
    let board;

    beforeEach(() => {
    // Initialize the board before each test
      board = Array(20).fill(null).map(() => Array(20).fill(null));
    });

    it('correctly evaluates a potential win for AI vertically', () => {
    // Set up a board where AI is about to win vertically
      for (let i = 0; i < 4; i++) {
        board[i][0] = AI;
      }

      const score = evaluateVertical(board, true, true);
      expect(score).toBe(Infinity); // Expect a positive score for AI's advantage
    });

    it('correctly evaluates a blocked AI opportunity vertically', () => {
    // Set up a board where AI's potential win is blocked by the player
      for (let i = 0; i < 3; i++) {
        board[i][1] = AI;
      }
      board[1][1] = PLAYER;

      const score = evaluateVertical(board, true, true);
      expect(score).toBe(1); // Expect a score less than a win, as the line is blocked
    });
  });

  describe('getScore', () => {
    let board;
    const AI = 'O';
    const PLAYER = 'X';

    beforeEach(() => {
      // Initialize the board before each test
      board = Array(20).fill(null).map(() => Array(20).fill(null));
    });

    it('correctly evaluates a strong AI advantage', () => {
      // Setup a board where AI has a clear advantage
      board[0][0] = board[0][1] = board[0][2] = board[0][3] = AI; // Horizontal line of 4 for AI
      const score = getScore(board, true, true);
      expect(score).toBeGreaterThan(0); // Expect a positive score for AI's advantage
    });

    it('correctly evaluates a strong player advantage', () => {
      // Setup a board where the player has a clear advantage
      board[1][0] = board[1][1] = board[1][2] = board[1][3] = PLAYER; // Horizontal line of 4 for Player
      const score = getScore(board, true, true);
      expect(score).toBe(0); // Since getScore currently only evaluates for AI, it should return a low score
    });

    it('correctly evaluates a neutral board', () => {
      // Setup a neutral board
      board[2][0] = AI;
      board[17][17] = PLAYER;
      const score = getScore(board, true, true);
      expect(score).toBe(4); // Neutral board should have a score close to 0
    });
  });
});
