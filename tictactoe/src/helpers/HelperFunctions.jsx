export const getAvailableCells = (boardStateAfterHuman) => {
  const availableCells = [];
  boardStateAfterHuman.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === null) {
        availableCells.push({ rowIndex, colIndex });
      }
    });
  });

  return availableCells;
};