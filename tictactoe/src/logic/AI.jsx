import { AI, PLAYER, params } from '../Config';
import { GameState } from '../components/GameState';
import { updateAvailableCells } from '../helpers/HelperFunctions';
import { checkForWin, getScore } from './GameHeuristics';

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

  let availableCells = moveOptions.map(row => row);

  let bestMove;

  // Check if there's a winning move available on the board
  //bestMove = checkForWinningMove(board, availableCells);

  // If a winning move is found, use that move
  //if (bestMove !== null) {
  //move.rowIndex = bestMove.rowIndex;
  //move.colIndex = bestMove.colIndex;
  //} else {
  // Initialize alpha and beta for alpha-beta pruning in the minimax algorithm
  let alpha = -10;
  let beta = 10;
  // Call the minimax function to find the best move for the current board state
  bestMove = minimax(board, availableCells, params.MAX_DEPTH, true, alpha, beta);
  // If a valid move is found, update the move object with its row and column indexes
  if (bestMove.rowIndex !== null) {
    move.rowIndex = bestMove.rowIndex;
    move.colIndex = bestMove.colIndex;
  }
  //}
  console.log(`bestMove is ${move.rowIndex}, ${move.colIndex} with a score of: ${bestMove.score}`);
  // Return the best move found
  return move;
};

// Minimax algorithm with alpha-beta pruning
export const minimax = (board, availableCells, depth, isMaximizing, alpha, beta, previousMove = null,) => {

  // Check if a terminal node is reached
  if (previousMove && typeof previousMove === 'object' && 'rowIndex' in previousMove && 'colIndex' in previousMove) {
    let result = checkForWin(board, previousMove);
    //console.log(`result for the board at state ${board} and for the move ${previousMove} is: ${result}. isMaximizing is set to ${isMaximizing}`);
    if (result === GameState.aiWins) {
      //console.log('reached a node where the AI wins, returning from recursion');
      return { score: 10, rowIndex: null, colIndex: null };
    } else if (result === GameState.playerWins) {
      //console.log('reached a node where the PLAYER wins, returning from recursion');
      //console.log(`player wins with ${previousMove.rowIndex}, ${previousMove.colIndex} with a score of ${params.MIN_SCORE}`);
      return { score: -10, rowIndex: null, colIndex: null };
    }
  }

  // Base case: Check if the maximum depth is reached
  if (depth <= 0) {
    // Evaluate the board and return the score along with null move coordinates
    return { score: 0, rowIndex: null, colIndex: null };
  }

  let bestMove = { score: null, rowIndex: null, colIndex: null };       // Initialize best move

  // Maximizing player logic (AI)
  if (isMaximizing) {
    let bestScore = -Infinity; // Initialize best score to the lowest possible value
    for (let move of availableCells) {
      //console.log(`checking ${move.rowIndex}, ${move.colIndex} for AI at depth ${depth}`);
      // Store the original available cells before the move
      const originalAvailableCells = [...availableCells];
      // Simulate the move
      board[move.rowIndex][move.colIndex] = AI;
      let newAvailableCells = updateAvailableCells(availableCells, move, board);
      // Recursively call minimax for the next level (minimizing player)
      let subTreeMove = minimax(board, newAvailableCells, depth - 1, false, alpha, beta, move);
      //console.log(`Minimax returned from depth ${depth - 1} to depth ${depth} with ${subTreeMove.rowIndex}, ${subTreeMove.colIndex} and a score of ${subTreeMove.score}`);
      // Undo the move
      board[move.rowIndex][move.colIndex] = null;
      availableCells = originalAvailableCells;

      if (subTreeMove.score > bestScore) {
        //console.log(`better score found for AI, updating bestScore to ${subTreeMove.score} and bestMove to ${move.rowIndex}, ${move.colIndex}`);
        bestScore = subTreeMove.score;
        bestMove.rowIndex = move.rowIndex;
        bestMove.colIndex = move.colIndex;
      }

      //console.log(`alpha check, current ${alpha} vs ${bestScore}`);
      alpha = Math.max(alpha, bestScore);

      if (beta <= alpha) {
        //console.log('beta less than or equal to alpha breaking from recursion');
        break;
      }
    }
    //console.log(`bestMove for the AI is ${bestMove.rowIndex}, ${bestMove.colIndex}`);
    bestMove.score = bestScore;
    return bestMove;
  }
  // Minimizing player logic
  else {
    let bestScore = Infinity; // Initialize best score to the highest possible value
    for (let move of availableCells) {
      //console.log(`checking ${move.rowIndex}, ${move.colIndex} for PLAYER at depth ${depth}`);
      // Store the original available cells before the move
      const originalAvailableCells = [...availableCells];
      // Simulate the move
      board[move.rowIndex][move.colIndex] = PLAYER;
      let newAvailableCells = updateAvailableCells(availableCells, move, board);
      // Recursively call minimax for the next level (maximizing player)
      let subTreeMove = minimax(board, newAvailableCells, depth - 1, true, alpha, beta, move);
      //console.log(`Minimax returned from depth ${depth - 1} to depth ${depth} with ${subTreeMove.rowIndex}, ${subTreeMove.colIndex} and a score of ${subTreeMove.score}`);
      // Undo the move
      board[move.rowIndex][move.colIndex] = null;
      availableCells = originalAvailableCells;

      if (subTreeMove.score < bestScore) {
        //console.log(`lower score found for PLAYER, updating bestScore to ${subTreeMove.score} and bestMove to ${move.rowIndex}, ${move.colIndex}`);
        bestScore = subTreeMove.score;
        bestMove.rowIndex = move.rowIndex;
        bestMove.colIndex = move.colIndex;
      }
      //console.log(`beta check, current ${beta} vs ${bestScore}`);
      beta = Math.min(beta, bestScore);

      if (beta <= alpha) {
        //console.log('beta less than or equal to alpha breaking from recursion');
        break;
      }
    }
    bestMove.score = bestScore;
    //console.log(`bestMove for the PLAYER is ${bestMove.rowIndex}, ${bestMove.colIndex}`);
    return bestMove;
  }
};

// Function to evaluate the board from the AI's perspective
export const evaluateBoardForAI = (board, playerTurn, depth) => {
  // Calculate scores for AI and player
  const aiScore = getScore(board, true, playerTurn);
  const playerScore = getScore(board, false, playerTurn);

  // Adjust scores for depth
  const adjustedAIScore = aiScore;
  const adjustedPlayerScore = playerScore;

  // Account for division by zero errors
  if (adjustedPlayerScore === 0) {
    return adjustedAIScore;
  }

  // Otherwise return relative difference of AI and player scores
  return adjustedAIScore / adjustedPlayerScore;
};