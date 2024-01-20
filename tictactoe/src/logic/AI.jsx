import { AI, PLAYER, params } from '../Config';
import { updateAvailableCells } from '../helpers/HelperFunctions';
import { getScore } from './GameHeuristics';

/// Function to check if there's a winning move available for AI
export const checkForWinningMove = (board, availableCells) => {

  let winningMove = { score: null, rowIndex: null, colIndex: null };

  // Iterate over each possible move
  for (let move of availableCells) {
    // Temporarily make the move on the board
    board[move.rowIndex][move.colIndex] = AI;

    // Calculate the score after this move
    let score = getScore(board, true, true);

    // Check if this score indicates a win
    if (score >= params.MAX_SCORE) {
      // If it's a winning move, return this move
      winningMove.rowIndex = move.rowIndex;
      winningMove.colIndex = move.colIndex;
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
export const selectBestMove = (board, moveOptions) => {
  // Initialize a move object to store the best move's row and column indexes
  let move = { rowIndex: null, colIndex: null };

  let availableCells = moveOptions;

  // Check if there's a winning move available on the board
  let bestMove = checkForWinningMove(board, availableCells);
  // If a winning move is found, use that move
  if (bestMove !== null) {
    move.rowIndex = bestMove.rowIndex;
    move.colIndex = bestMove.colIndex;
  } else {
    // Initialize alpha and beta for alpha-beta pruning in the minimax algorithm
    let alpha = params.MIN_SCORE;
    let beta = params.MAX_SCORE;
    // Call the minimax function to find the best move for the current board state
    bestMove = minimax(board, availableCells, params.MAX_DEPTH, true, alpha, beta);
    // If a valid move is found, update the move object with its row and column indexes
    if (bestMove.rowIndex !== null) {
      move.rowIndex = bestMove.rowIndex;
      move.colIndex = bestMove.colIndex;
    }
  }
  // Return the best move found
  return move;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (board, availableCells, depth, isMaximizing, alpha, beta) => {

  // Base case: Check if the maximum depth is reached or a terminal state
  if (depth <= 0) {
    // Evaluate the board and return the score along with null move coordinates
    return { score: evaluateBoardForAI(board, !isMaximizing, depth), rowIndex: null, colIndex: null };
  }

  let bestMove = null;       // Initialize best move

  // Maximizing player logic (AI)
  if (isMaximizing) {
    let bestScore = -Infinity; // Initialize best score to the lowest possible value
    for (let move of availableCells) {
      // Store the original available cells before the move
      const originalAvailableCells = [...availableCells];
      // Simulate the move
      board[move.rowIndex][move.colIndex] = AI;
      let newAvailableCells = updateAvailableCells(availableCells, move, board);
      // Recursively call minimax for the next level (minimizing player)
      let subTreeMove = minimax(board, newAvailableCells, depth - 1, false, alpha, beta);
      // Undo the move
      board[move.rowIndex][move.colIndex] = null;
      availableCells = originalAvailableCells;

      // Check for early termination if winning score is found
      if (subTreeMove.score >= params.MAX_SCORE) {
        return { score: subTreeMove.score, rowIndex: move.rowIndex, colIndex: move.colIndex };
      }

      // Update the best score and move if a better score is found
      if (subTreeMove.score > bestScore) {
        bestScore = subTreeMove.score;
        bestMove = { score: bestScore, rowIndex: move.rowIndex, colIndex: move.colIndex };
        alpha = Math.max(alpha, bestScore); // Update alpha for alpha-beta pruning
      }

      // Alpha-beta pruning
      if (alpha >= beta) {
        return subTreeMove;
      }
    }
  }
  // Minimizing player logic
  else {
    let bestScore = Infinity; // Initialize best score to the highest possible value
    for (let move of availableCells) {
      // Store the original available cells before the move
      const originalAvailableCells = [...availableCells];
      // Simulate the move
      board[move.rowIndex][move.colIndex] = PLAYER;
      let newAvailableCells = updateAvailableCells(availableCells, move, board);
      // Recursively call minimax for the next level (maximizing player)
      let subTreeMove = minimax(board, newAvailableCells, depth - 1, true, alpha, beta);
      // Undo the move
      board[move.rowIndex][move.colIndex] = null;
      availableCells = originalAvailableCells;

      if (subTreeMove.score <= -params.MAX_SCORE) {
        return { score: subTreeMove.score, rowIndex: move.rowIndex, colIndex: move.colIndex };
      }

      // Update the best score and move if a better score is found
      if (subTreeMove.score < bestScore) {
        bestScore = subTreeMove.score;
        bestMove = { score: bestScore, rowIndex: move.rowIndex, colIndex: move.colIndex };
        beta = Math.min(beta, bestScore); // Update beta for alpha-beta pruning
      }


      // Alpha-beta pruning
      if (alpha >= beta) {
        return subTreeMove;
      }
    }
  }
  return bestMove;
};

// Function to evaluate the board from the AI's perspective
export const evaluateBoardForAI = (board, playerTurn, depth) => {
  // Calculate scores for AI and player
  const aiScore = getScore(board, true, playerTurn);
  const playerScore = getScore(board, false, playerTurn);

  // Adjust scores for depth
  const adjustedAIScore = aiScore - depth;
  const adjustedPlayerScore = playerScore + depth;

  // Account for division by zero errors
  if (adjustedPlayerScore === 0) {
    return adjustedAIScore;
  }

  // Otherwise return relative difference of AI and player scores
  return adjustedAIScore / adjustedPlayerScore;
};
