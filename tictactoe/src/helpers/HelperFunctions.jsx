export const getAvailableCells = (board) => {
  const moves = [];
  const boardSize = board.length;

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] !== null) continue; // Skip already marked cells

      let adjacentFound = false;

      // Check adjacent cells
      for (let di = -1; di <= 1 && !adjacentFound; di++) {
        for (let dj = -1; dj <= 1 && !adjacentFound; dj++) {
          if (di === 0 && dj === 0) continue; // Skip the cell itself

          const adjI = i + di;
          const adjJ = j + dj;

          if (adjI >= 0 && adjI < boardSize && adjJ >= 0 && adjJ < boardSize && board[adjI][adjJ] !== null) {
            moves.push({ rowIndex: i, colIndex: j });
            adjacentFound = true; // Mark that an adjacent cell is found
          }
        }
      }
    }
  }

  return moves;
};