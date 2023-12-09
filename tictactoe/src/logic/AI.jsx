import { AI, params } from '../Config';
import { getAvailableCells } from '../helpers/HelperFunctions';
import { checkForWinMinimax, getScore } from './GameHeuristics';

/// Function to check if there's a winning move available for AI
export const checkForWinningMove = (board, moves) => {
  // Iterate over each possible move
  for (let move of moves) {
    // Temporarily make the move on the board
    board[move.rowIndex][move.colIndex] = AI;

    // Calculate the score after this move
    let score = getScore(board, true, true);

    // Check if this score indicates a win
    if (score >= params.MAX_SCORE) {
      // If it's a winning move, return this move
      let winningMove = { rowIndex: move.rowIndex, colIndex: move.colIndex };
      // Revert the temporary move
      board[move.rowIndex][move.colIndex] = null;
      return winningMove;
    }

    // Revert the temporary move before checking the next one
    board[move.rowIndex][move.colIndex] = null;
  }
  // If no winning move is found, return null
  return null;
};

// Function to select the best move for the AI
export const selectBestMove = (board) => {
  // Get all available moves (cells that are viable for making a move)
  let moves = getAvailableCells(board);

  // First, check if there's a winning move
  let bestMove = checkForWinningMove(board, moves);
  if (bestMove !== null) {
    return bestMove;
  }

  // Initialize variables for Minimax algorithm
  let bestScore = params.MIN_SCORE;
  let alpha = params.MIN_SCORE;
  let beta = params.MAX_SCORE;

  // Iterate over each possible move
  for (let move of moves) {
    // Temporarily make the move on the board
    board[move.rowIndex][move.colIndex] = AI;

    // Apply the minimax algorithm to find the best score
    let score = minimax(board, 0, false, move.rowIndex, move.colIndex, AI, alpha, beta);

    // Revert the temporary move
    board[move.rowIndex][move.colIndex] = null;

    // Update the best score and move if the current score is better
    if (score > bestScore) {
      bestScore = score;
      bestMove = { rowIndex: move.rowIndex, colIndex: move.colIndex };
      // Update alpha for alpha-beta pruning
      alpha = Math.max(alpha, bestScore);
    }
  }

  // Return the best move found
  return bestMove;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (board, depth, isMaximizing, lastRow, lastCol, maximizingPlayer, alpha, beta) => {
  // Check if maximum depth is reached or a terminal state (win/lose/draw) is reached
  if (depth === params.MAX_DEPTH) {
    return evaluateBoardForAI(board, true);
  }

  // Check for win/lose condition at this node
  let result = checkForWinMinimax(board, lastRow, lastCol, maximizingPlayer);
  if (result !== null) {
    return result;
  }

  // Maximizing player (AI) logic
  if (isMaximizing) {
    let bestScore = params.MIN_SCORE;
    let moves = getAvailableCells(board);
    for (let move of moves) {
      board[move.rowIndex][move.colIndex] = maximizingPlayer;
      let score = minimax(board, depth + 1, false, move.rowIndex, move.colIndex, maximizingPlayer, alpha, beta);
      board[move.rowIndex][move.colIndex] = null;
      bestScore = Math.max(score, bestScore);
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) {
        break; // Alpha-beta pruning
      }
    }
    return bestScore;
  }
  // Minimizing player logic
  else {
    let bestScore = params.MAX_SCORE;
    let moves = getAvailableCells(board);
    for (let move of moves) {
      board[move.rowIndex][move.colIndex] = (maximizingPlayer === 'X' ? 'O' : 'X');
      let score = minimax(board, depth + 1, true, move.rowIndex, move.colIndex, maximizingPlayer, alpha, beta);
      board[move.rowIndex][move.colIndex] = null;
      bestScore = Math.min(score, bestScore);
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) {
        break; // Alpha-beta pruning
      }
    }
    return bestScore;
  }
};

// Function to evaluate the board from the AI's perspective
export const evaluateBoardForAI = (board, isAiTurn) => {
  // Calculate scores for AI and player
  const aiScore = getScore(board, true, isAiTurn);
  const playerScore = getScore(board, false, isAiTurn);

  // If player has no score, return AI's score
  if (playerScore === 0) return aiScore;

  // Otherwise, return the difference between AI's score and player's score
  return aiScore - playerScore;
};
