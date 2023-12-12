import { AI, PLAYER, params } from '../Config';
import { getAvailableCells } from '../helpers/HelperFunctions';
import { getScore } from './GameHeuristics';

/// Function to check if there's a winning move available for AI
export const checkForWinningMove = (board) => {
  // Get all available moves (cells that are viable for making a move)
  let moves = getAvailableCells(board);
  let winningMove = { score: null, rowIndex: null, colIndex: null };

  // Iterate over each possible move
  for (let move of moves) {
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
export const selectBestMove = (board) => {
  // Initialize a move object to store the best move's row and column indexes
  let move = { rowIndex: null, colIndex: null };

  // Check if there's a winning move available on the board
  let bestMove = checkForWinningMove(board);
  // If a winning move is found, use that move
  if (bestMove !== null) {
    move.rowIndex = bestMove.rowIndex;
    move.colIndex = bestMove.colIndex;
  } else {
    // Initialize alpha and beta for alpha-beta pruning in the minimax algorithm
    let alpha = params.MIN_SCORE;
    let beta = params.MAX_SCORE;
    // Call the minimax function to find the best move for the current board state
    bestMove = minimax(board, 0, true, alpha, beta);
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
const minimax = (board, depth, isMaximizing, alpha, beta) => {
  // Base case: Check if the maximum depth is reached or a terminal state
  if (depth === params.MAX_DEPTH) {
    // Evaluate the board and return the score along with null move coordinates
    return { score: evaluateBoardForAI(board, !isMaximizing), rowIndex: null, colIndex: null };
  }

  // Get all available moves (empty cells) from the board
  let moves = getAvailableCells(board);

  // Maximizing player logic (AI)
  if (isMaximizing) {
    let bestScore = -Infinity; // Initialize best score to the lowest possible value
    let bestMove = null;       // Initialize best move
    for (let move of moves) {
      // Simulate the move
      board[move.rowIndex][move.colIndex] = AI;
      // Recursively call minimax for the next level (minimizing player)
      let subTreeMove = minimax(board, depth + 1, false, alpha, beta);
      // Undo the move
      board[move.rowIndex][move.colIndex] = null;

      // Update the best score and move if a better score is found
      if (subTreeMove.score > bestScore) {
        bestScore = subTreeMove.score;
        bestMove = { score: bestScore, rowIndex: move.rowIndex, colIndex: move.colIndex };
        alpha = Math.max(alpha, bestScore); // Update alpha for alpha-beta pruning
      }

      // Alpha-beta pruning
      if (alpha >= beta) {
        break;
      }
    }
    return bestMove; // Return the best move found
  }
  // Minimizing player logic
  else {
    let bestScore = Infinity; // Initialize best score to the highest possible value
    let bestMove = null;      // Initialize best move
    for (let move of moves) {
      // Simulate the move
      board[move.rowIndex][move.colIndex] = PLAYER;
      // Recursively call minimax for the next level (maximizing player)
      let subTreeMove = minimax(board, depth + 1, true, alpha, beta);
      // Undo the move
      board[move.rowIndex][move.colIndex] = null;

      // Update the best score and move if a better score is found
      if (subTreeMove.score < bestScore) {
        bestScore = subTreeMove.score;
        bestMove = { score: bestScore, rowIndex: move.rowIndex, colIndex: move.colIndex };
        beta = Math.min(beta, bestScore); // Update beta for alpha-beta pruning
      }

      // Alpha-beta pruning
      if (alpha >= beta) {
        break;
      }
    }
    return bestMove; // Return the best move found
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
  return aiScore / playerScore;
};
