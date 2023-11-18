import { selectCell } from './AI';

describe('selectCell function', () => {
  test('returns a cell object when availableCells is not empty', () => {
    const availableCells = [{ rowIndex: 0, colIndex: 0 }, { rowIndex: 0, colIndex: 1 }];
    const cell = selectCell(availableCells);
    expect(cell).toBeDefined();
    expect(cell).toHaveProperty('rowIndex');
    expect(cell).toHaveProperty('colIndex');
  });

  test('returns a cell from the availableCells array', () => {
    const availableCells = [{ rowIndex: 0, colIndex: 0 }, { rowIndex: 0, colIndex: 1 }];
    const cell = selectCell(availableCells);
    expect(availableCells).toContainEqual(cell);
  });

  test('returns undefined when availableCells is empty', () => {
    const cell = selectCell([]);
    expect(cell).toBeUndefined();
  });
});
