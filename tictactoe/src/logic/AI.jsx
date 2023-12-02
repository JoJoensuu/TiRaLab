import { AI } from '../Config';
import { getAvailableCells } from '../helpers/HelperFunctions';
import { checkForWinMinimax, getScore } from './GameHeuristics';

const MIN_SCORE = -Infinity;
const MAX_SCORE = Infinity;
const MAX_DEPTH = 3;

export const selectBestMove = (board, lastRow, lastCol, lastPlayer) => {
  let bestScore = MIN_SCORE;
  let bestMove = {};
  let moves = getAvailableCells(board);

  let alpha = MIN_SCORE;
  let beta = MAX_SCORE;

  for (let move of moves) {
    board[move.rowIndex][move.colIndex] = AI;
    let score = minimax(board, 0, false, move.rowIndex, move.colIndex, AI, alpha, beta);
    board[move.rowIndex][move.colIndex] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = { rowIndex: move.rowIndex, colIndex: move.colIndex };
      alpha = Math.max(alpha, bestScore);
    }
  }
  return bestMove;
};

const minimax = (board, depth, isMaximizing, lastRow, lastCol, maximizingPlayer, alpha, beta) => {
  if (depth === MAX_DEPTH) {
    return evaluateBoardForAI(board, true);
  }

  let result = checkForWinMinimax(board, lastRow, lastCol, maximizingPlayer);
  if (result !== null) {
    return result;
  }

  if (isMaximizing) {
    let bestScore = MIN_SCORE;
    let moves = getAvailableCells(board); // Only consider viable moves instead of the whole board
    for (let move of moves) {
      board[move.rowIndex][move.colIndex] = maximizingPlayer;
      let score = minimax(board, depth + 1, false, move.rowIndex, move.colIndex, maximizingPlayer, alpha, beta);
      board[move.rowIndex][move.colIndex] = null;
      bestScore = Math.max(score, bestScore);
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) {
        break;
      }
    }
    return bestScore;
  } else {
    let bestScore = MAX_SCORE;
    let moves = getAvailableCells(board); // Only consider viable moves instead of the whole board
    for (let move of moves) {
      board[move.rowIndex][move.colIndex] = (maximizingPlayer === 'X' ? 'O' : 'X');
      let score = minimax(board, depth + 1, true, move.rowIndex, move.colIndex, maximizingPlayer, alpha, beta);
      board[move.rowIndex][move.colIndex] = null;
      bestScore = Math.min(score, bestScore);
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) {
        break;
      }
    }
    return bestScore;
  }
};

export const evaluateBoardForAI = (board, isAiTurn) => {
  const aiScore = getScore(board, true, isAiTurn);
  const playerScore = getScore(board, false, isAiTurn);

  if (playerScore === 0) return aiScore;

  return aiScore - playerScore;
};
