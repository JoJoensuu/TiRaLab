import { PLAYER, AI } from '../Config';
import { GameState } from '../components/GameState';
import { scores, params } from '../Config';

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

export const getScore = (board, forPlayer, isPlayerTurn) => {
  // Calculate score for horizontal and vertical directions
  const horizontalScore = evaluateHorizontal(board, forPlayer, isPlayerTurn);
  const verticalScore = evaluateVertical(board, forPlayer, isPlayerTurn);
  const diagonalScore = evaluateDiagonal(board, forPlayer, isPlayerTurn);

  // Sum the scores from horizontal and vertical evaluations
  return horizontalScore + verticalScore + diagonalScore;
};

export const evaluateHorizontal = (board, forPlayer, isPlayerTurn) => {
  let evaluations = [0, 2, 0]; // [0]: consecutive count, [1]: block count, [2]: score

  for (let i = 0; i < board.length; i++) {
    // Check if the row contains any occupied cells
    if (rowHasOccupiedCells(board[i])) {
      for (let j = 0; j < board[i].length; j++) {
        evaluateDirections(board, i, j, forPlayer, isPlayerTurn, evaluations);
      }
      evaluateDirectionsAfterOnePass(evaluations, forPlayer, isPlayerTurn);
    }
  }

  return evaluations[2];
};

export const evaluateVertical = (board, forPlayer, isPlayerTurn) => {
  let evaluations = [0, 2, 0]; // [0]: consecutive count, [1]: block count, [2]: score

  for (let j = 0; j < board[0].length; j++) {
    // Check if the column contains any occupied cells
    if (columnHasOccupiedCells(board, j)) {
      for (let i = 0; i < board.length; i++) {
        evaluateDirections(board, i, j, forPlayer, isPlayerTurn, evaluations);
      }
      evaluateDirectionsAfterOnePass(evaluations, forPlayer, isPlayerTurn);
    }
  }

  return evaluations[2];
};

export const evaluateDiagonal = (board, forPlayer, isPlayerTurn) => {
  let evaluations = [0, 2, 0];
  const boardSize = board.length;

  // Helper function to check if a diagonal has any occupied cells
  const diagonalHasOccupiedCells = (board, k, isMajor) => {
    let iStart = isMajor ? Math.max(0, k - boardSize + 1) : Math.max(0, k);
    let iEnd = isMajor ? Math.min(boardSize - 1, k) : Math.min(boardSize + k - 1, boardSize - 1);
    for (let i = iStart; i <= iEnd; ++i) {
      let j = isMajor ? k - i : i - k;
      if (board[i][j] !== null) {
        return true;
      }
    }
    return false;
  };

  // From bottom-left to top-right diagonally
  for (let k = 0; k <= 2 * (boardSize - 1); k++) {
    if (diagonalHasOccupiedCells(board, k, true)) {
      let iStart = Math.max(0, k - boardSize + 1);
      let iEnd = Math.min(boardSize - 1, k);
      for (let i = iStart; i <= iEnd; ++i) {
        evaluateDirections(board, i, k - i, forPlayer, isPlayerTurn, evaluations);
      }
      evaluateDirectionsAfterOnePass(evaluations, forPlayer, isPlayerTurn);
    }
  }

  // From top-left to bottom-right diagonally
  for (let k = 1 - boardSize; k < boardSize; k++) {
    if (diagonalHasOccupiedCells(board, k, false)) {
      let iStart = Math.max(0, k);
      let iEnd = Math.min(boardSize + k - 1, boardSize - 1);
      for (let i = iStart; i <= iEnd; ++i) {
        evaluateDirections(board, i, i - k, forPlayer, isPlayerTurn, evaluations);
      }
      evaluateDirectionsAfterOnePass(evaluations, forPlayer, isPlayerTurn);
    }
  }
  return evaluations[2];
};


// Function to calculate the score based on the number of consecutive marks, how many ends are blocked, and whose turn it is
export const getConsecutiveScore = (count, blocked, currentTurn) => {
  // Define a high score for winning condition
  let WIN_SCORE = 10000;

  // If both ends of the sequence are blocked and the count is less than 5, the sequence is not useful
  if (blocked === 2 && count < 5) return 0;

  switch (count) {
  case 5: // A count of 5 means a win
    return params.MAX_SCORE;
  case 4: // For 4 consecutive marks
    if (currentTurn) return WIN_SCORE / 2; // If it's the current player's turn, a high score is assigned
    else {
      // If it's not the current player's turn
      if (blocked === 0) return WIN_SCORE / 4; // Higher score if neither end is blocked
      else return 200; // Lower score if at least one end is blocked
    }
  case 3: // For 3 consecutive marks
    if (blocked === 0) {
      // Higher score if neither end is blocked
      if (currentTurn) return 50000; // Very high score if it's the current player's turn
      else return 200; // Lower score if it's not the current player's turn
    } else {
      // For blocked sequences
      if (currentTurn) return 10; // Lower score if it's the current player's turn
      else return 5; // Even lower if it's not
    }
  case 2: // For 2 consecutive marks
    if (blocked === 0) {
      // Slightly higher score if neither end is blocked
      if (currentTurn) return 7; // Slightly higher if it's the current player's turn
      else return 5; // Slightly lower if not
    } else {
      return 3; // Lowest score for 2 marks with at least one end blocked
    }
  case 1: // For a single mark, a nominal score is assigned
    return 1;
  default:
    // For more than 5 consecutive marks, assign double the win score
    return WIN_SCORE * 2;
  }
};

export const evaluateDirections = (board, rowIndex, colIndex, isAI, isAITurn, scoreData) => {
  // Retrieve the content of the current cell being evaluated
  const cell = board[rowIndex][colIndex];

  // Determine the marks for the current player and the opponent based on whether the AI is evaluating
  const currentPlayerMark = isAI ? AI : PLAYER;
  const opponentMark = isAI ? PLAYER : AI;

  // If the current cell contains the current player's mark
  if (cell === currentPlayerMark) {
    // Increment the consecutive count
    scoreData[0]++;
  }
  // If the current cell is empty
  else if (cell === null) {
    // If there was a sequence of consecutive marks before this empty cell
    if (scoreData[0] > 0) {
      // Decrement the block count since an empty cell is not a block
      scoreData[1]--;
      // Calculate and add the score for the current sequence up to the empty cell
      scoreData[2] += getConsecutiveScore(scoreData[0], scoreData[1], isAI === isAITurn);
      // Reset the consecutive count since the sequence has been broken
      scoreData[0] = 0;
    }
    // Since this cell is empty, it's a potential start of a new sequence, so set block count to 1
    scoreData[1] = 1;
  }
  // If the cell contains the opponent's mark and there was a sequence of the current player's marks before this
  else if (cell === opponentMark && scoreData[0] > 0) {
    // Calculate and add the score for the sequence that ends with the opponent's mark
    scoreData[2] += getConsecutiveScore(scoreData[0], scoreData[1], isAI === isAITurn);
    // Reset the consecutive count since the sequence has ended
    scoreData[0] = 0;
    // Set block count to 2 because the opponent's mark is a block
    scoreData[1] = 2;
  }
  // If the cell contains the opponent's mark but there was no preceding sequence of the current player's marks
  else {
    // Set block count to 2 because the opponent's mark is a block and there's no sequence to score
    scoreData[1] = 2;
  }
};

export const evaluateDirectionsAfterOnePass = (scoreData, isAI, isPlayerTurn) => {
  // If there were any consecutive AI marks before reaching the end
  if (scoreData[0] > 0) {
    scoreData[2] += getConsecutiveScore(scoreData[0], scoreData[1], isAI === isPlayerTurn);
  }
  // Reset consecutive marks and block count
  scoreData[0] = 0;
  scoreData[1] = 2;
};

// Helper function to check if a row has any occupied cells
const rowHasOccupiedCells = (row) => {
  return row.some(cell => cell !== null);
};

// Helper function to check if a column has any occupied cells
const columnHasOccupiedCells = (board, columnIndex) => {
  return board.some(row => row[columnIndex] !== null);
};