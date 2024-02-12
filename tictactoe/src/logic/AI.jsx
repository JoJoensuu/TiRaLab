import { AI, PLAYER, params, scores } from '../Config';
import { GameState } from '../components/GameState';
import { updateAvailableCells } from '../helpers/HelperFunctions';
import { checkForWin } from './GameHeuristics';

/// Function to check if there's a winning move available for AI
export const checkForWinningMove = (board, availableCells) => {
  let winningMove = { score: null, rowIndex: null, colIndex: null };
  // Iterate over each possible move
  for (let move of availableCells) {
    // Temporarily make the move on the board
    board[move.rowIndex][move.colIndex] = AI;
    // Calculate the score after this move
    let result = checkForWin(board, move);
    // Check if this score indicates a win
    if (result === GameState.aiWins) {
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

  let availableCells = moveOptions.map(row => row);

  // Check if there's a winning move available on the board
  let bestMove = checkForWinningMove(board, availableCells);

  // If a winning move is found, use that move
  if (bestMove !== null) {
    move.rowIndex = bestMove.rowIndex;
    move.colIndex = bestMove.colIndex;
  } else {
  // Initialize alpha and beta for alpha-beta pruning in the minimax algorithm
    let alpha = params.ALPHA;
    let beta = params.BETA;
    // Call the minimax function to find the best move for the current board state
    bestMove = minimax(board, availableCells, 0, true, alpha, beta);
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
export const minimax = (board, availableCells, depth, isMaximizing, alpha, beta, previousMove = null,) => {

  // Check if a terminal node is reached
  if (previousMove && typeof previousMove === 'object' && 'rowIndex' in previousMove && 'colIndex' in previousMove) {
    let result = checkForWin(board, previousMove);
    if (result === GameState.aiWins) {
      return { score: scores.WIN_SCORE - depth, rowIndex: null, colIndex: null };
    } else if (result === GameState.playerWins) {
      return { score: scores.LOSE_SCORE + depth, rowIndex: null, colIndex: null };
    }
  }

  // Base case: Check if the maximum depth is reached
  if (depth >= params.MAX_DEPTH) {
    // Evaluate the board and return the score along with null move coordinates
    return { score: scores.DRAW_SCORE, rowIndex: null, colIndex: null };
  }

  // Initialize best move
  let bestMove = { score: null, rowIndex: null, colIndex: null };

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
      let subTreeMove = minimax(board, newAvailableCells, depth + 1, false, alpha, beta, move);
      // Undo the move
      board[move.rowIndex][move.colIndex] = null;
      availableCells = originalAvailableCells;

      if (subTreeMove.score > bestScore) {
        bestScore = subTreeMove.score;
        bestMove.rowIndex = move.rowIndex;
        bestMove.colIndex = move.colIndex;
      }

      alpha = Math.max(alpha, bestScore);

      if (beta <= alpha) {
        break;
      }
    }
    bestMove.score = bestScore;
    return bestMove;
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
      let subTreeMove = minimax(board, newAvailableCells, depth + 1, true, alpha, beta, move);
      // Undo the move
      board[move.rowIndex][move.colIndex] = null;
      availableCells = originalAvailableCells;

      if (subTreeMove.score < bestScore) {
        bestScore = subTreeMove.score;
        bestMove.rowIndex = move.rowIndex;
        bestMove.colIndex = move.colIndex;
      }
      beta = Math.min(beta, bestScore);

      if (beta <= alpha) {
        break;
      }
    }
    bestMove.score = bestScore;
    return bestMove;
  }
};