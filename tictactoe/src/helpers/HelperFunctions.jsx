export const getAvailableCells = (board) => {
  const availableCells = [];
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === null) {
        availableCells.push({ rowIndex, colIndex });
      }
    });
  });

  return availableCells;
};