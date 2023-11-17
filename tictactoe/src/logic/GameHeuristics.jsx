const checkHorizontal = (board, row, col, currentPlayer) => {
  let count = 1; // Start the count at 1 to include the current cell

  // Check to the left
  for (let i = col - 1; i >= 0 && board[row][i] === currentPlayer; i--) {
    count++;
    if (count >= 5) return true; // Win condition met
  }

  // Check to the right
  for (let i = col + 1; i < board[row].length && board[row][i] === currentPlayer; i++) {
    count++;
    if (count >= 5) return true; // Win condition met
  }
  return false;
};

const checkVertical = (board, row, col, currentPlayer) => {
  let count = 1;

  // Check up
  for (let i = row - 1; i >= 0 && board[i][col] === currentPlayer; i--) {
    count++;
    if (count >= 5) return true;
  }

  for (let i = row + 1; i < board[col].length && board[i][col] === currentPlayer; i++) {
    count++;
    if (count >= 5) return true;
  }
  return false;
};

export const checkForWin = (board, row, col) => {
  const currentPlayer = board[row][col];
  if (checkHorizontal(board, row, col, currentPlayer)) return true;
  if (checkVertical(board, row, col, currentPlayer)) return true;

  return false;
};