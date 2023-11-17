const checkHorizontal = (board, row, col) => {
  const currentPlayer = board[row][col];
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

export const checkForWin = (board, row, col) => {
  if (checkHorizontal(board, row, col)) {
    return true;
  }

  return false;
};