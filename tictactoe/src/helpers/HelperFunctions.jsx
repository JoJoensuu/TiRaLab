export const getAvailableCells = (board) => {
  const moves = [];
  const boardSize = board.length;

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] !== null) continue; // Skip already marked cells

      // Check for occupied cells within a 2-cell radius
      for (let di = -2; di <= 2; di++) {
        for (let dj = -2; dj <= 2; dj++) {
          if (di === 0 && dj === 0) continue; // Skip the cell itself

          const adjI = i + di;
          const adjJ = j + dj;

          // Check bounds and cell occupancy
          if (adjI >= 0 && adjI < boardSize && adjJ >= 0 && adjJ < boardSize && board[adjI][adjJ] !== null) {
            moves.push({ rowIndex: i, colIndex: j });
            // Once an adjacent cell is found, no need to check further for this cell
            di = dj = 3; // Break out of both loops
          }
        }
      }
    }
  }

  return moves;
};

export const updateAvailableCells = (availableCells, move, board) => {
  const boardSize = board.length;
  let newAvailableCells = availableCells.filter(cell => cell.rowIndex !== move.rowIndex || cell.colIndex !== move.colIndex);

  // Check and add new adjacent cells within a 2-cell radius
  for (let di = -2; di <= 2; di++) {
    for (let dj = -2; dj <= 2; dj++) {
      if (di === 0 && dj === 0) continue; // Skip the cell itself (the move's cell)

      const adjI = move.rowIndex + di;
      const adjJ = move.colIndex + dj;

      // Check if within board bounds
      if (adjI >= 0 && adjI < boardSize && adjJ >= 0 && adjJ < boardSize) {
        // Check if the cell is empty and not already in availableCells
        if (board[adjI][adjJ] === null && !newAvailableCells.some(cell => cell.rowIndex === adjI && cell.colIndex === adjJ)) {
          newAvailableCells.push({ rowIndex: adjI, colIndex: adjJ });
        }
      }
    }
  }

  return newAvailableCells;
};

export const handleAvailableCellsUpdate = (availableCells, move, board) => {
  if (availableCells.length <= 0) {
    const boardState = getAvailableCells(board);
    return boardState;
  } else {
    const newMove = [move.rowIndex, move.colIndex];
    const boardState = updateAvailableCells(availableCells, newMove, board);
    return boardState;
  }
};