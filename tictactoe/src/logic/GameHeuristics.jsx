import { PLAYER } from '../Config';
import { GameState } from '../components/GameState';
import { scores } from '../Config';

const checkHorizontal = (board, rowIndex, colIndex, currentPlayer) => {
  let count = 1; // Start the count at 1 to include the current cell

  // Check to the left
  for (let i = colIndex - 1; i >= 0 && board[rowIndex][i] === currentPlayer; i--) {
    count++;
    if (count >= 5) return true; // Win condition met
  }

  // Check to the right
  for (let i = colIndex + 1; i < board[rowIndex].length && board[rowIndex][i] === currentPlayer; i++) {
    count++;
    if (count >= 5) return true; // Win condition met
  }
  return false;
};

const checkVertical = (board, rowIndex, colIndex, currentPlayer) => {
  let count = 1;

  // Check up
  for (let i = rowIndex - 1; i >= 0 && board[i][colIndex] === currentPlayer; i--) {
    count++;
    if (count >= 5) return true; // Win condition met
  }
  // Check down
  for (let i = rowIndex + 1; i < board[colIndex].length && board[i][colIndex] === currentPlayer; i++) {
    count++;
    if (count >= 5) return true; // Win condition met
  }
  return false;
};

const checkDiagonal = (board, rowIndex, colIndex, currentPlayer) => {
  let count = 1;

  // Check major diagonal (top-left to bottom-right)
  // Check upper left
  for (let i = rowIndex - 1, j = colIndex - 1; i >= 0 && j >= 0 && board[i][j] === currentPlayer; i--, j--) {
    count++;
    if (count >= 5) return true;
  }
  // Check lower right
  for (let i = rowIndex + 1, j = colIndex + 1; i < board.length && j < board[i].length && board[i][j] === currentPlayer; i++, j++) {
    count++;
    if (count >= 5) return true;
  }

  // Reset count for minor diagonal
  count = 1;

  // Check minor diagonal (top-right to bottom-left)
  // Check upper right
  for (let i = rowIndex - 1, j = colIndex + 1; i >= 0 && j < board[i].length && board[i][j] === currentPlayer; i--, j++) {
    count++;
    if (count >= 5) return true;
  }
  // Check lower left
  for (let i = rowIndex + 1, j = colIndex - 1; i < board.length && j >= 0 && board[i][j] === currentPlayer; i++, j--) {
    count++;
    if (count >= 5) return true;
  }

  return false;
};

export const checkForWin = (board, rowIndex, colIndex) => {
  const currentPlayer = board[rowIndex][colIndex];
  if (checkHorizontal(board, rowIndex, colIndex, currentPlayer) ||
    checkVertical(board, rowIndex, colIndex, currentPlayer) ||
    checkDiagonal(board, rowIndex, colIndex, currentPlayer)) {
    return currentPlayer === PLAYER ? GameState.playerWins : GameState.aiWins;
  }

  const isDraw = board.every(row => row.every(cell => cell !== null));
  if (isDraw) {
    return GameState.draw;
  }
  return GameState.inProgress;
};

export const checkForWinMinimax = (board, rowIndex, colIndex, maximizingPlayer) => {
  const currentPlayer = board[rowIndex][colIndex];

  if (checkHorizontal(board, rowIndex, colIndex, currentPlayer) ||
      checkVertical(board, rowIndex, colIndex, currentPlayer) ||
      checkDiagonal(board, rowIndex, colIndex, currentPlayer)) {
    return currentPlayer === maximizingPlayer ? scores.WIN_SCORE : scores.LOSE_SCORE;
  }

  const isDraw = board.every(row => row.every(cell => cell !== null));
  if (isDraw) {
    return scores.DRAW_SCORE;
  }

  return null;
};