import { describe, expect, it } from 'vitest';
import { Board } from '../../src/solver/Board';
import { BoardLine } from '../../src/solver/BoardLine';
import { CellStatus } from '../../src/solver/CellStatus';

describe('BoardLine domain helpers', () => {
  it('correctly determines whether a hint can be added to a line', () => {
    // 5-cell line with hint 5 takes 5 cells, cannot add more
    expect(BoardLine.canAddHint([5], 5)).toBe(false);
    // 5-cell line with hints [2, 1] takes 2 + 1 + 1 = 4 cells; adding 1 would require 4 + 1 + 1 = 6 > 5
    expect(BoardLine.canAddHint([2, 1], 5)).toBe(false);
    // 5-cell line with hint 2 takes 2 cells; adding 1 requires 2 + 1 + 1 = 4 <= 5
    expect(BoardLine.canAddHint([2], 5)).toBe(true);
    // empty hints on 5-cell line can add
    expect(BoardLine.canAddHint([], 5)).toBe(true);
  });

  it('correctly calculates the maximum value an existing hint can have without exceeding line space', () => {
    // line size 5, hints [2, 1]: hint 0 can be at most 5 - 1 (other) - 1 (separator) = 3
    expect(BoardLine.getMaxHintValue([2, 1], 0, 5)).toBe(3);
    // hint 1 can be at most 5 - 2 (other) - 1 (separator) = 2
    expect(BoardLine.getMaxHintValue([2, 1], 1, 5)).toBe(2);
    // line size 5, single hint [2]: can be at most 5
    expect(BoardLine.getMaxHintValue([2], 0, 5)).toBe(5);
  });

  it('extracts contiguous blocks of specific cell status', () => {
    const board = Board.create({
      size: 6,
      rows: [[], [], [], [], [], []],
      cols: [[], [], [], [], [], []],
    });
    const row = board.rows[0];

    // Set row to: [Filled, Filled, Unknown, Filled, Empty, Empty]
    row.cells[0].status = CellStatus.Filled;
    row.cells[1].status = CellStatus.Filled;
    row.cells[2].status = CellStatus.Unknown;
    row.cells[3].status = CellStatus.Filled;
    row.cells[4].status = CellStatus.Empty;
    row.cells[5].status = CellStatus.Empty;

    const filledBlocks = BoardLine.getContiguousBlocks(row, CellStatus.Filled);
    expect(filledBlocks).toEqual([
      { startIndex: 0, endIndex: 1, size: 2, status: CellStatus.Filled },
      { startIndex: 3, endIndex: 3, size: 1, status: CellStatus.Filled },
    ]);

    const emptyBlocks = BoardLine.getContiguousBlocks(row, CellStatus.Empty);
    expect(emptyBlocks).toEqual([
      { startIndex: 4, endIndex: 5, size: 2, status: CellStatus.Empty },
    ]);

    const unknownBlocks = BoardLine.getContiguousBlocks(row, CellStatus.Unknown);
    expect(unknownBlocks).toEqual([
      { startIndex: 2, endIndex: 2, size: 1, status: CellStatus.Unknown },
    ]);
  });

  it('locates first and last playable boundaries, skipping leading and trailing Empty cells', () => {
    const board = Board.create({
      size: 5,
      rows: [[], [], [], [], []],
      cols: [[], [], [], [], []],
    });
    const row = board.rows[0];

    // All Unknown: boundaries are 0 and 4
    expect(BoardLine.getFirstPlayableBoundary(row)).toBe(0);
    expect(BoardLine.getLastPlayableBoundary(row)).toBe(4);

    // [Empty, Empty, Filled, Unknown, Empty]
    row.cells[0].status = CellStatus.Empty;
    row.cells[1].status = CellStatus.Empty;
    row.cells[2].status = CellStatus.Filled;
    row.cells[3].status = CellStatus.Unknown;
    row.cells[4].status = CellStatus.Empty;

    expect(BoardLine.getFirstPlayableBoundary(row)).toBe(2);
    expect(BoardLine.getLastPlayableBoundary(row)).toBe(3);

    // All Empty
    row.cells[2].status = CellStatus.Empty;
    row.cells[3].status = CellStatus.Empty;

    expect(BoardLine.getFirstPlayableBoundary(row)).toBe(-1);
    expect(BoardLine.getLastPlayableBoundary(row)).toBe(-1);
  });
});
