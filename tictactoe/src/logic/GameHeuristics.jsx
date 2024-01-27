import { PLAYER } from '../Config';
import { GameState } from '../components/GameState';
import { params } from '../Config';

const checkHorizontal = (board, rowIndex, colIndex, currentPlayer) => {
  let count = 1; // Start the count at 1 to include the current cell

  // Check to the left
  for (let i = colIndex - 1; i >= 0 && board[rowIndex][i] === currentPlayer; i--) {
    count++;
    if (count >= params.WINNING_STRAIGHT) return true; // Win condition met
  }

  // Check to the right
  for (let i = colIndex + 1; i < board[rowIndex].length && board[rowIndex][i] === currentPlayer; i++) {
    count++;
    if (count >= params.WINNING_STRAIGHT) return true; // Win condition met
  }
  return false;
};

const checkVertical = (board, rowIndex, colIndex, currentPlayer) => {
  let count = 1;

  // Check up
  for (let i = rowIndex - 1; i >= 0 && board[i][colIndex] === currentPlayer; i--) {
    count++;
    if (count >= params.WINNING_STRAIGHT) return true; // Win condition met
  }
  // Check down
  for (let i = rowIndex + 1; i < board[colIndex].length && board[i][colIndex] === currentPlayer; i++) {
    count++;
    if (count >= params.WINNING_STRAIGHT) return true; // Win condition met
  }
  return false;
};

const checkDiagonal = (board, rowIndex, colIndex, currentPlayer) => {
  let count = 1;

  // Check major diagonal (top-left to bottom-right)
  // Check upper left
  for (let i = rowIndex - 1, j = colIndex - 1; i >= 0 && j >= 0 && board[i][j] === currentPlayer; i--, j--) {
    count++;
    if (count >= params.WINNING_STRAIGHT) return true;
  }
  // Check lower right
  for (let i = rowIndex + 1, j = colIndex + 1; i < board.length && j < board[i].length && board[i][j] === currentPlayer; i++, j++) {
    count++;
    if (count >= params.WINNING_STRAIGHT) return true;
  }

  // Reset count for minor diagonal
  count = 1;

  // Check minor diagonal (top-right to bottom-left)
  // Check upper right
  for (let i = rowIndex - 1, j = colIndex + 1; i >= 0 && j < board[i].length && board[i][j] === currentPlayer; i--, j++) {
    count++;
    if (count >= params.WINNING_STRAIGHT) return true;
  }
  // Check lower left
  for (let i = rowIndex + 1, j = colIndex - 1; i < board.length && j >= 0 && board[i][j] === currentPlayer; i++, j--) {
    count++;
    if (count >= params.WINNING_STRAIGHT) return true;
  }

  return false;
};

// Function to check for a win or draw in the game
export const checkForWin = (board, move) => {
  let rowIndex = move.rowIndex;
  let colIndex = move.colIndex;
  // Identify the current player based on the last move
  const currentPlayer = board[rowIndex][colIndex];

  // Check if the current player has won horizontally, vertically, or diagonally
  if (checkHorizontal(board, rowIndex, colIndex, currentPlayer) ||
    checkVertical(board, rowIndex, colIndex, currentPlayer) ||
    checkDiagonal(board, rowIndex, colIndex, currentPlayer)) {
    // If a win is detected, return the corresponding game state (player or AI wins)
    return currentPlayer === PLAYER ? GameState.playerWins : GameState.aiWins;
  }

  // Check if the game is a draw (no empty cells left on the board)
  const isDraw = board.every(row => row.every(cell => cell !== null));
  if (isDraw) {
    // If it's a draw, return the draw game state
    return GameState.draw;
  }

  // If neither a win nor a draw, the game is still in progress
  return GameState.inProgress;
};
