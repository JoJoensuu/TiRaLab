import { PLAYER, AI } from '../Config';
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

export const getScore = (board, isAI, isAITurn) => {
  // Calculate score for horizontal and vertical directions
  const horizontalScore = evaluateHorizontal(board, isAI, isAITurn);
  const verticalScore = evaluateVertical(board, isAI, isAITurn);
  const diagonalScore = evaluateDiagonal(board, isAI, isAITurn);

  // Sum the scores from horizontal and vertical evaluations
  return horizontalScore + verticalScore + diagonalScore;
};

export const evaluateHorizontal = (board, isAI, isAITurn) => {
  let evaluations = [0, 2, 0]; // [0]: consecutive count, [1]: block count, [2]: score

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      evaluateDirections(board, i, j, isAI, isAITurn, evaluations);
    }
    evaluateDirectionsAfterOnePass(evaluations, isAI, isAITurn);
  }

  return evaluations[2];
};

export const evaluateVertical = (board, isAI, isAITurn) => {
  let evaluations = [0, 2, 0]; // [0]: consecutive count, [1]: block count, [2]: score

  for (let j = 0; j < board[0].length; j++) {
    for (let i = 0; i < board.length; i++) {
      evaluateDirections(board, i, j, isAI, isAITurn, evaluations);
    }
    evaluateDirectionsAfterOnePass(evaluations, isAI, isAITurn);
  }

  return evaluations[2];
};

export const evaluateDiagonal = (board, isAI, isAITurn) => {
  let evaluations = [0, 2, 0]; // [0]: consecutive count, [1]: block count, [2]: score
  const boardSize = board.length;

  // From bottom-left to top-right diagonally
  for (let k = 0; k <= 2 * (boardSize - 1); k++) {
    let iStart = Math.max(0, k - boardSize + 1);
    let iEnd = Math.min(boardSize - 1, k);
    for (let i = iStart; i <= iEnd; ++i) {
      evaluateDirections(board, i, k - i, isAI, isAITurn, evaluations);
    }
    evaluateDirectionsAfterOnePass(evaluations, isAI, isAITurn);
  }

  // From top-left to bottom-right diagonally
  for (let k = 1 - boardSize; k < boardSize; k++) {
    let iStart = Math.max(0, k);
    let iEnd = Math.min(boardSize + k - 1, boardSize - 1);
    for (let i = iStart; i <= iEnd; ++i) {
      evaluateDirections(board, i, i - k, isAI, isAITurn, evaluations);
    }
    evaluateDirectionsAfterOnePass(evaluations, isAI, isAITurn);
  }

  return evaluations[2];
};

export const getConsecutiveScore = (count, blocked, currentTurn) => {
  let WIN_SCORE = Infinity;

  if (blocked === 2 && count < 5) return 0;

  switch (count) {
  case 5:
    return WIN_SCORE;
  case 4:
    if (currentTurn) return WIN_SCORE / 2;
    else {
      if (blocked === 0) return WIN_SCORE / 4;
      else return 200;
    }
  case 3:
    if (blocked === 0) {
      if (currentTurn) return 50000;
      else return 200;
    } else {
      if (currentTurn) return 10;
      else return 5;
    }
  case 2:
    if (blocked === 0) {
      if (currentTurn) return 7;
      else return 5;
    } else {
      return 3;
    }
  case 1:
    return 1;
  default:
    return WIN_SCORE * 2;
  }
};

export const evaluateDirections = (board, rowIndex, colIndex, isAI, isAITurn, scoreData) => {
  const cell = board[rowIndex][colIndex];

  if (cell === AI) {
    scoreData[0]++;
  } else if (cell === null) {
    if (scoreData[0] > 0) {
      scoreData[1]--;
      scoreData[2] += getConsecutiveScore(scoreData[0], scoreData[1], isAI === isAITurn);
      scoreData[0] = 0;
    }
    scoreData[1] = 1;
  } else if (cell === PLAYER && scoreData[0] > 0) {
    scoreData[2] += getConsecutiveScore(scoreData[0], scoreData[1], isAI === isAITurn);
    scoreData[0] = 0;
    scoreData[1] = 2;
  } else {
    scoreData[1] = 2;
  }
};

export const evaluateDirectionsAfterOnePass = (scoreData, isAI, isAITurn) => {
  // If there were any consecutive AI marks before reaching the end
  if (scoreData[0] > 0) {
    scoreData[2] += getConsecutiveScore(scoreData[0], scoreData[1], isAI === isAITurn);
  }
  // Reset consecutive marks and block count
  scoreData[0] = 0;
  scoreData[1] = 2;
};
