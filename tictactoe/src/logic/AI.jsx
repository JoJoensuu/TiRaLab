import { AI } from '../Config';
import { getAvailableCells } from '../helpers/HelperFunctions';
import { checkForWinMinimax } from './GameHeuristics';

const MIN_SCORE = -Infinity;
const MAX_SCORE = Infinity;
const MAX_DEPTH = 2;

export const selectBestMove = (board, lastRow, lastCol, lastPlayer) => {
  let bestScore = MIN_SCORE;
  let bestMove = {};
  let moves = getAvailableCells(board);

  for (let move of moves) {
    board[move.rowIndex][move.colIndex] = AI;
    let score = minimax(board, 0, true, move.rowIndex, move.colIndex, AI);
    board[move.rowIndex][move.colIndex] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = { rowIndex: move.rowIndex, colIndex: move.colIndex };
    }
  }

  return bestMove;
};

const minimax = (board, depth, isMaximizing, lastRow, lastCol, maximizingPlayer) => {
  if (depth === MAX_DEPTH) {
    return 0;
  }

  let result = checkForWinMinimax(board, lastRow, lastCol, maximizingPlayer);
  if (result !== null) {
    return result;
  }

  if (isMaximizing) {
    let bestScore = MIN_SCORE;
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (board[i][j] === null) {
          board[i][j] = maximizingPlayer;
          let score = minimax(board, depth + 1, false, i, j, maximizingPlayer);
          board[i][j] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = MAX_SCORE;
    const opponent = maximizingPlayer === 'X' ? 'O' : 'X';
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (board[i][j] === null) {
          board[i][j] = opponent;
          let score = minimax(board, depth + 1, true, i, j, maximizingPlayer);
          board[i][j] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
};

const minimaxSub = (board, depth, isMaximizing, lastRow, lastCol, maximizingPlayer) => {
  return 1;
};