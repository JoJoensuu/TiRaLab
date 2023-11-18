export const selectCell = (availableCells) => {
  if (availableCells.length > 0) {
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    return randomCell;
  }
};